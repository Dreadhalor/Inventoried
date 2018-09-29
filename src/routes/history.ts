import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import * as express from 'express';
const router = express.Router();
const config = require('../server-config');
const History = require('../models/tables').History;
const dbClient = require('@dreadhalor/sql-client');
const auth = require('../utilities/auth');
const assignments = require('./assignments');
const err = require('../utilities/error');
const util = require('util');

let subscription = dbClient.history.subscribe(
  next => {
    if (next.table != 'history') record(next)
    //console.log(util.inspect(next, false, null));
  }
);

const record = exports.record = (edit) => {
  let entry: any = {
    //id: uuid(),
    transactionId: edit.transactionId,
    timestamp: edit.timestamp,
    //agent: edit.agent,
    tables: edit.tables
  }
  //console.log(entry);
  History.save(entry, {standalone: true});
}

router.get('/pull_all', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Fetch history error')
    .broken(error => res.json(error))
    .then(authorized => History.pullAll())
    .then(history => res.json({
      error: null,
      result: history
    }))
    .catch(error => res.json(err.formatError(error, 'Fetch history error')));
});

router.post('/condense', (req, res) => {
  let uuid = req.body.uuid;
  let history = [];
    History.pullAll()
      .then(entries => {
        let filtered = splitEntries(entries);
        filtered = getAssignmentCheckouts(filtered);
        res.json(filtered);
      })
      .catch(error => res.json(error));
})

module.exports.router = router;

const filterEntriesIncludingId = (entries: any[], id: string) => {
  let stringified = entries.map(entry => JSON.stringify(entry))
  let filtered = stringified.filter(entry => entry.includes(id));
  return filtered.map(entry => JSON.parse(entry));
}
const filterEntriesForId = (entries: any[], id: string) => {
  let filtered = filterEntriesIncludingId(entries, id);
  let result = [];
  filtered.forEach(entry => {
    let added = false;
    if (entry.info.created){
      entry.info.created.forEach(op => {
        if (op.id == id && !added){
          result.push(entry);
          added = true;
        }
      })
    }
    if (entry.info.updated && !added){
      entry.info.updated.forEach(op => {
        if (op.created.id == id && !added){
          result.push(entry);
          added = true;
        }
      })
    }
    if (entry.info.deleted && !added){
      entry.info.deleted.forEach(op => {
        if (op.id == id && !added){
          result.push(entry);
          added = true;
        }
      })
    }
  })
  return result;
}
const splitEntries = (entries: any[]) => {
  let result = [];
  let created = entries.map(entry => entry.info.created);
  created.forEach((entry, index) => {
    if (entry){
      let parent = entries[index];
      entry.forEach(op => {
        result.push({
          id: parent.id,
          timestamp: parent.timestamp,
          agent: parent.agent,
          table: parent.table,
          operation: 'create',
          info: {
            created: op
          }
        })
      })
    }
  })

  let updated = entries.map(entry => entry.info.updated);
  updated.forEach((entry, index) => {
    if (entry){
      let parent = entries[index];
      entry.forEach(op => {
        result.push({
          id: parent.id,
          timestamp: parent.timestamp,
          agent: parent.agent,
          table: parent.table,
          operation: 'update',
          info: {
            created: op.created,
            deleted: op.deleted
          }
        })
      })
    }
  })

  let deleted = entries.map(entry => entry.info.deleted);
  deleted.forEach((entry, index) => {
    if (entry){
      let parent = entries[index];
      entry.forEach(op => {
        result.push({
          id: parent.id,
          timestamp: parent.timestamp,
          agent: parent.agent,
          table: parent.table,
          operation: 'delete',
          info: {
            deleted: op
          }
        })
      })
    }
  })

  return result;
}
const groupEntries = (entries: any) => {
  let split = splitEntries(entries);
  let result = {};
  for (let i = 0; i < split.length; i++){
    let matches = [];
    let id = getIdOfSingleOp(split[i]);
    for (let j = 0; j < split.length; j++){
      let id2 = getIdOfSingleOp(split[j]);
      if (id2 == id) matches.push(j);
    }
    while (matches.length > 0){
      let index = matches.pop();
      let entry = split.splice(index,1)[0];
      if (!result[id]) result[id] = [];
      result[id].push(entry);
    }
  }
  return result;
}
const getIdOfSingleOp = (entry: any) => {
  switch(entry.operation){
    case 'delete':
      return entry.info.deleted.id;
    case 'update':
    case 'create':
      return entry.info.created.id;
  }
}
const getAssignmentCheckouts = (entries: any[]) => {
  let filtered = entries.filter(match => match.table == 'assignments' && match.operation == 'create');
  return filtered;
}

//entered asset
//checked out asset

//admin x checked out n assets to person z
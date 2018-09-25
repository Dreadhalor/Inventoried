import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import * as express from 'express';
const router = express.Router();
const config = require('../server-config');
const History = require('../models/tables').History;
const dbClient = require('@dreadhalor/sql-client');
const auth = require('../utilities/auth');
const assignments = require('./assignments');

let subscription = dbClient.history.subscribe(
  next => {
    if (next.table != 'history') record(next)
  }
);

const record = exports.record = (edit) => {
  let entry: any = {
    id: uuid(),
    timestamp: moment().format(config.historyFormat),
    agent: edit.agent,
    table: edit.table,
    operation: edit.operation,
    info: {
      created: edit.created,
      updated: edit.updated,
      deleted: edit.deleted
    }
  }
  History.save(entry);
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
    History.pullAll()
      .then(entries => {
        let filtered = filterEntriesIncludingId(entries, uuid);
        //let created = filtered.filter(entry => entry.operation == 'create');
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
  
}
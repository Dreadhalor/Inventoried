import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import * as express from 'express';
const router = express.Router();
const config = require('../program-config');
const History = require('../models/tables/History');
const dbClient = require('../db/db-client');

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
  History.pullAll()
    .then(history => res.json(history))
    .catch(exception => res.json([]));
});

module.exports.router = router;
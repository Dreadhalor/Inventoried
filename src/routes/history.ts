import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import * as express from 'express';
const router = express.Router();
const config = require('../server-config');
const History = require('../models/tables').History;
const dbClient = require('@dreadhalor/sql-client');
const auth = require('../utilities/auth');

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
  auth.checkAdminAuthorization(authorization, 'Fetch history error')
    .broken(error => res.json(error))
    .then(authorized => History.pullAll())
    .then(history => res.json({
      error: null,
      result: history
    }))
    .catch(exception => res.json({
      error: {
        title: 'Fetch history error',
        message: JSON.stringify(exception)
      }
    }));
});

module.exports.router = router;
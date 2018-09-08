import * as moment from 'moment';
import * as uuid from 'uuid/v4';
import * as express from 'express';
const router = express.Router();
const config = require('../config');
const History = require('../models/tables/History');

const record = exports.record = (edit) => {
  let entry = {
    id: uuid(),
    timestamp: moment().format(config.historyFormat),
    agent: edit.agent,
    table: edit.table,
    operation: edit.operation,
    info: {
      inserted: edit.inserted,
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
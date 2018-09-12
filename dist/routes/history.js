"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const uuid = require("uuid/v4");
const express = require("express");
const router = express.Router();
const config = require('../config');
const History = require('../models/tables/History');
const dbClient = require('../db/db-client');
let subscription = dbClient.history.subscribe(next => {
    if (next.table != 'history')
        record(next);
});
const record = exports.record = (edit) => {
    let entry = {
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
    };
    History.save(entry);
};
router.get('/pull_all', (req, res) => {
    History.pullAll()
        .then(history => res.json(history))
        .catch(exception => res.json([]));
});
module.exports.router = router;
//# sourceMappingURL=history.js.map
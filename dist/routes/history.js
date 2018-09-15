"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var uuid = require("uuid/v4");
var express = require("express");
var router = express.Router();
var config = require('../program-config');
var History = require('../models/tables/History');
var dbClient = require('@dreadhalor/sql-client');
var subscription = dbClient.history.subscribe(function (next) {
    if (next.table != 'history')
        record(next);
});
var record = exports.record = function (edit) {
    var entry = {
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
router.get('/pull_all', function (req, res) {
    History.pullAll()
        .then(function (history) { return res.json(history); })
        .catch(function (exception) { return res.json([]); });
});
module.exports.router = router;
//# sourceMappingURL=history.js.map
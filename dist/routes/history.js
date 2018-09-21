"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var uuid = require("uuid/v4");
var express = require("express");
var router = express.Router();
var config = require('../server-config');
var History = require('../models/tables').History;
var dbClient = require('@dreadhalor/sql-client');
var auth = require('../utilities/auth');
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
    var authorization = req.headers.authorization;
    auth.checkAdminAuthorization(authorization, 'Fetch history error')
        .broken(function (error) { return res.json(error); })
        .then(function (authorized) { return History.pullAll(); })
        .then(function (history) { return res.json({
        error: null,
        result: history
    }); })
        .catch(function (exception) { return res.json({
        error: {
            title: 'Fetch history error',
            message: JSON.stringify(exception)
        }
    }); });
});
module.exports.router = router;
//# sourceMappingURL=history.js.map
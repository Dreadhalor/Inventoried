"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var History;
(function (History) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'history',
        columns: [
            'id',
            'timestamp',
            'agent',
            'table',
            'operation',
            'info'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(History = exports.History || (exports.History = {}));
//# sourceMappingURL=History.js.map
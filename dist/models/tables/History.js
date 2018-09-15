"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var History;
(function (History) {
    var dbClient = require('@dreadhalor/sql-client');
    var schema = {
        tableName: 'history',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'timestamp', dataType: 'string' },
            { name: 'agent', dataType: 'string' },
            { name: 'table', dataType: 'string' },
            { name: 'operation', dataType: 'string' },
            { name: 'info', dataType: 'object' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(History = exports.History || (exports.History = {}));
//# sourceMappingURL=History.js.map
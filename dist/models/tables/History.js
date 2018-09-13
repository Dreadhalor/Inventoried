"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var History;
(function (History) {
    const dbClient = require('../../db/db-client');
    const schema = {
        tableName: 'history',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'timestamp', dataType: 'varchar(max)' },
            { name: 'agent', dataType: 'varchar(max)' },
            { name: 'table', dataType: 'varchar(max)' },
            { name: 'operation', dataType: 'varchar(max)' },
            { name: 'info', dataType: 'object' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(History = exports.History || (exports.History = {}));
//# sourceMappingURL=History.js.map
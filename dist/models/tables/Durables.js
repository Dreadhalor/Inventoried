"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Durables;
(function (Durables) {
    var dbClient = require('@dreadhalor/sql-client');
    var schema = {
        tableName: 'durables',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'serialNumber', dataType: 'string' },
            { name: 'categoryId', dataType: 'string' },
            { name: 'manufacturerId', dataType: 'string' },
            { name: 'notes', dataType: 'string' },
            { name: 'assignmentId', dataType: 'string' },
            { name: 'tagIds', dataType: 'string[]' },
            { name: 'active', dataType: 'bit' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Durables = exports.Durables || (exports.Durables = {}));
//# sourceMappingURL=Durables.js.map
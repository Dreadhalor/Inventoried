"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Assignments;
(function (Assignments) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'assignments',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'userId', dataType: 'string' },
            { name: 'assetId', dataType: 'string' },
            { name: 'checkoutDate', dataType: 'string' },
            { name: 'dueDate', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(tableSchema);
})(Assignments = exports.Assignments || (exports.Assignments = {}));
//# sourceMappingURL=Assignments.js.map
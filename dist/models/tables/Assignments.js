"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Assignments;
(function (Assignments) {
    const dbClient = require('../../db/db-client');
    const schema = {
        tableName: 'assignments',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'userId', dataType: 'varchar(max)' },
            { name: 'assetId', dataType: 'varchar(max)' },
            { name: 'checkoutDate', dataType: 'varchar(max)' },
            { name: 'dueDate', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Assignments = exports.Assignments || (exports.Assignments = {}));
//# sourceMappingURL=Assignments.js.map
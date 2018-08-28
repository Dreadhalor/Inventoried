"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient = require('../classes/db-client');
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
//# sourceMappingURL=AssignmentsTable.1.js.map
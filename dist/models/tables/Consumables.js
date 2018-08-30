"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient = require('../../db/db-client');
const schema = {
    tableName: 'consumables',
    columns: [
        { name: 'id', dataType: 'varchar(max)', primary: true },
        { name: 'label', dataType: 'varchar(max)' },
        { name: 'quantity', dataType: 'int' },
        { name: 'categoryId', dataType: 'varchar(max)' },
        { name: 'manufacturerId', dataType: 'varchar(max)' },
        { name: 'notes', dataType: 'varchar(max)' },
        { name: 'assignmentIds', dataType: 'varbinary(max)' },
        { name: 'tagIds', dataType: 'varbinary(max)' }
    ]
};
module.exports = dbClient.Table(schema);
//# sourceMappingURL=Consumables.js.map
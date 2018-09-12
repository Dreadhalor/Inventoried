"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient = require('../../db/db-client');
const schema = {
    tableName: 'users',
    columns: [
        { name: 'id', dataType: 'varchar(max)', primary: true },
        { name: 'assignmentIds', dataType: 'varchar(max)[]' }
    ]
};
module.exports = dbClient.Table(schema);
//# sourceMappingURL=Users.js.map
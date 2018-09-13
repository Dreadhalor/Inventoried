"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consumables;
(function (Consumables) {
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
            { name: 'assignmentIds', dataType: 'varchar(max)[]' },
            { name: 'tagIds', dataType: 'varchar(max)[]' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Consumables = exports.Consumables || (exports.Consumables = {}));
//# sourceMappingURL=Consumables.js.map
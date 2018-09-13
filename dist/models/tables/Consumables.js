"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consumables;
(function (Consumables) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'consumables',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'label', dataType: 'string' },
            { name: 'quantity', dataType: 'int' },
            { name: 'categoryId', dataType: 'string' },
            { name: 'manufacturerId', dataType: 'string' },
            { name: 'notes', dataType: 'string' },
            { name: 'assignmentIds', dataType: 'string[]' },
            { name: 'tagIds', dataType: 'string[]' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Consumables = exports.Consumables || (exports.Consumables = {}));
//# sourceMappingURL=Consumables.js.map
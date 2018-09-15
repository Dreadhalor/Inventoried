"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consumables;
(function (Consumables) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'consumables',
        columns: [
            'id',
            'label',
            'quantity',
            'categoryId',
            'manufacturerId',
            'notes',
            'assignmentIds',
            'tagIds'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(Consumables = exports.Consumables || (exports.Consumables = {}));
//# sourceMappingURL=Consumables.js.map
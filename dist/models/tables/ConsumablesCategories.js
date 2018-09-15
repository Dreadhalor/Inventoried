"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConsumablesCategories;
(function (ConsumablesCategories) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'consumablesCategories',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(tableSchema);
})(ConsumablesCategories = exports.ConsumablesCategories || (exports.ConsumablesCategories = {}));
//# sourceMappingURL=ConsumablesCategories.js.map
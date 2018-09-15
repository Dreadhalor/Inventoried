"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConsumablesCategories;
(function (ConsumablesCategories) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'consumablesCategories',
        columns: [
            'id',
            'value'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(ConsumablesCategories = exports.ConsumablesCategories || (exports.ConsumablesCategories = {}));
//# sourceMappingURL=ConsumablesCategories.js.map
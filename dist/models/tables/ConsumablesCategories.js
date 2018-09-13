"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConsumablesCategories;
(function (ConsumablesCategories) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'consumablesCategories',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'value', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(ConsumablesCategories = exports.ConsumablesCategories || (exports.ConsumablesCategories = {}));
//# sourceMappingURL=ConsumablesCategories.js.map
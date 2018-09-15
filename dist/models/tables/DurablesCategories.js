"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DurablesCategories;
(function (DurablesCategories) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'durablesCategories',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(tableSchema);
})(DurablesCategories = exports.DurablesCategories || (exports.DurablesCategories = {}));
//# sourceMappingURL=DurablesCategories.js.map
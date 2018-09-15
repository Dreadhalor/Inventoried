"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DurablesCategories;
(function (DurablesCategories) {
    var dbClient = require('@dreadhalor/sql-client');
    var schema = {
        tableName: 'durablesCategories',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(DurablesCategories = exports.DurablesCategories || (exports.DurablesCategories = {}));
//# sourceMappingURL=DurablesCategories.js.map
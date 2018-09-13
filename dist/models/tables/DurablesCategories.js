"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DurablesCategories;
(function (DurablesCategories) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'durablesCategories',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'value', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(DurablesCategories = exports.DurablesCategories || (exports.DurablesCategories = {}));
//# sourceMappingURL=DurablesCategories.js.map
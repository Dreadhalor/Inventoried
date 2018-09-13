"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DurablesCategories;
(function (DurablesCategories) {
    const dbClient = require('../../db/db-client');
    const schema = {
        tableName: 'durablesCategories',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'value', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(DurablesCategories = exports.DurablesCategories || (exports.DurablesCategories = {}));
//# sourceMappingURL=DurablesCategories.js.map
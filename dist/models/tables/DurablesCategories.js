"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DurablesCategories;
(function (DurablesCategories) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'durablesCategories',
        columns: [
            'id',
            'value'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(DurablesCategories = exports.DurablesCategories || (exports.DurablesCategories = {}));
//# sourceMappingURL=DurablesCategories.js.map
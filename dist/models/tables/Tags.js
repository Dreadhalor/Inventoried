"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags;
(function (Tags) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'tags',
        columns: [
            'id',
            'value'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(Tags = exports.Tags || (exports.Tags = {}));
//# sourceMappingURL=Tags.js.map
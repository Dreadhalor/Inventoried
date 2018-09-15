"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags;
(function (Tags) {
    var dbClient = require('@dreadhalor/sql-client');
    var schema = {
        tableName: 'tags',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Tags = exports.Tags || (exports.Tags = {}));
//# sourceMappingURL=Tags.js.map
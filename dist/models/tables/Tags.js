"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tags;
(function (Tags) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'tags',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'value', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Tags = exports.Tags || (exports.Tags = {}));
//# sourceMappingURL=Tags.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Users;
(function (Users) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'users',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'assignmentIds', dataType: 'string[]' }
        ]
    };
    module.exports = dbClient.Table(tableSchema);
})(Users = exports.Users || (exports.Users = {}));
//# sourceMappingURL=Users.js.map
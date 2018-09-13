"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Users;
(function (Users) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'users',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'assignmentIds', dataType: 'string[]' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Users = exports.Users || (exports.Users = {}));
//# sourceMappingURL=Users.js.map
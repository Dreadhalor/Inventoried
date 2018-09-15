"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Assignments;
(function (Assignments) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'assignments',
        columns: [
            'id',
            'userId',
            'assetId',
            'checkoutDate',
            'dueDate'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(Assignments = exports.Assignments || (exports.Assignments = {}));
//# sourceMappingURL=Assignments.js.map
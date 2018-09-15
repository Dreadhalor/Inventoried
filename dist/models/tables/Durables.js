"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Durables;
(function (Durables) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'durables',
        columns: [
            'id',
            'serialNumber',
            'categoryId',
            'manufacturerId',
            'notes',
            'assignmentId',
            'tagIds',
            'active'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(Durables = exports.Durables || (exports.Durables = {}));
//# sourceMappingURL=Durables.js.map
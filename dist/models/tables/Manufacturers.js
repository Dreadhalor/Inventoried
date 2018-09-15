"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Manufacturers;
(function (Manufacturers) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'manufacturers',
        columns: [
            'id',
            'value'
        ],
        primary: 'id'
    };
    module.exports = dbClient.Table(tableSchema);
})(Manufacturers = exports.Manufacturers || (exports.Manufacturers = {}));
//# sourceMappingURL=Manufacturers.js.map
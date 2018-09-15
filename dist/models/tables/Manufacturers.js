"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Manufacturers;
(function (Manufacturers) {
    var dbClient = require('@dreadhalor/sql-client');
    var schema = {
        tableName: 'manufacturers',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Manufacturers = exports.Manufacturers || (exports.Manufacturers = {}));
//# sourceMappingURL=Manufacturers.js.map
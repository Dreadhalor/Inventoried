"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Manufacturers;
(function (Manufacturers) {
    var dbClient = require('@dreadhalor/sql-client');
    var tableSchema = {
        name: 'manufacturers',
        columns: [
            { name: 'id', dataType: 'string', primary: true },
            { name: 'value', dataType: 'string' }
        ]
    };
    module.exports = dbClient.Table(tableSchema);
})(Manufacturers = exports.Manufacturers || (exports.Manufacturers = {}));
//# sourceMappingURL=Manufacturers.js.map
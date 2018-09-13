"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Manufacturers;
(function (Manufacturers) {
    var dbClient = require('../../db/db-client');
    var schema = {
        tableName: 'manufacturers',
        columns: [
            { name: 'id', dataType: 'varchar(max)', primary: true },
            { name: 'value', dataType: 'varchar(max)' }
        ]
    };
    module.exports = dbClient.Table(schema);
})(Manufacturers = exports.Manufacturers || (exports.Manufacturers = {}));
//# sourceMappingURL=Manufacturers.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Durable = /** @class */ (function () {
    function Durable() {
    }
    Durable.sample = function () {
        var sample = {
            id: '',
            serialNumber: '',
            categoryId: '',
            manufacturerId: '',
            notes: '',
            assignmentId: '',
            tagIds: [''],
            active: true
        };
        return sample;
    };
    Durable.sqlFieldsWithValues = function (durable) {
        return {
            tableName: 'durables',
            fields: ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            types: ['varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'bit'],
            durable: durable
        };
    };
    return Durable;
}());
exports.Durable = Durable;
//# sourceMappingURL=durable.js.map
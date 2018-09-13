"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Consumable = /** @class */ (function () {
    function Consumable() {
    }
    Consumable.sample = function () {
        var sample = {
            id: '',
            label: '',
            quantity: 0,
            categoryId: '',
            manufacturerId: '',
            notes: '',
            assignmentIds: [''],
            tagIds: ['']
        };
        return sample;
    };
    Consumable.sqlFieldsWithValues = function (consumable) {
        return {
            tableName: 'consumables',
            fields: ['id', 'label', 'quantity', 'categoryId', 'manufacturerId', 'notes', 'assignmentIds', 'tagIds'],
            types: ['varchar(max)', 'varchar(max)', 'int', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)[]', 'varchar(max)[]'],
            consumable: consumable
        };
    };
    return Consumable;
}());
exports.Consumable = Consumable;
//# sourceMappingURL=consumable.js.map
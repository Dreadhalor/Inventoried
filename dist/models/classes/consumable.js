"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Consumable {
    static sample() {
        let sample = {
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
    }
    static sqlFieldsWithValues(consumable) {
        return {
            tableName: 'consumables',
            fields: ['id', 'label', 'quantity', 'categoryId', 'manufacturerId', 'notes', 'assignmentIds', 'tagIds'],
            types: ['varchar(max)', 'varchar(max)', 'int', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)[]', 'varchar(max)[]'],
            consumable: consumable
        };
    }
}
exports.Consumable = Consumable;
//# sourceMappingURL=consumable.js.map
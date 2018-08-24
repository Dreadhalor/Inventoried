"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("./asset");
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
            types: ['varchar(max)', 'varchar(max)', 'int', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)'],
            values: asset_1.Asset.formatAsset(consumable)
        };
    }
}
exports.Consumable = Consumable;
//# sourceMappingURL=consumable.js.map
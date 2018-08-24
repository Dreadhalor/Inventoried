"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("./asset");
let db = require('./db');
class Durable {
    static sample() {
        let sample = {
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
    }
    static sqlFieldsWithValues(durable) {
        return {
            tableName: 'durables',
            fields: ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            types: ['varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'bit'],
            values: asset_1.Asset.formatAsset(durable)
        };
    }
}
exports.Durable = Durable;
//# sourceMappingURL=durable.js.map
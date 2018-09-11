"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            durable: durable
        };
    }
}
exports.Durable = Durable;
//# sourceMappingURL=durable.js.map
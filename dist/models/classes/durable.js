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
    static sqlFields() {
        return [
            'durables',
            ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            ['varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'text', 'bit']
        ];
    }
    static sqlFieldsWithValues(vals) {
        return [
            'durables',
            ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            vals
        ];
    }
    static formatDurable(idurable) {
        let keys = Object.keys(idurable);
        let result = [];
        keys.forEach((key) => result.push = idurable[key].join(','));
        return result;
    }
}
exports.Durable = Durable;
//# sourceMappingURL=durable.js.map
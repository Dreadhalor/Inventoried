"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    static sqlFields() {
        return [
            'durables',
            ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            ['varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'bit']
        ];
    }
    static sqlFieldsWithValues(durable) {
        return {
            tableName: 'durables',
            fields: ['id', 'serialNumber', 'categoryId', 'manufacturerId', 'notes', 'assignmentId', 'tagIds', 'active'],
            types: ['varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'varchar(max)', 'bit'],
            values: this.formatDurable(durable)
        };
    }
    static formatDurable(idurable) {
        let keys = Object.keys(idurable);
        let result = [];
        keys.forEach((key) => {
            if (typeof idurable[key] == 'object')
                result.push(idurable[key].join(','));
            else
                result.push(idurable[key]);
        });
        return result;
    }
}
exports.Durable = Durable;
//# sourceMappingURL=durable.js.map
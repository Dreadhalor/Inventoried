"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(db, schema) {
        this.columns = [];
        this.db = db;
        this.tableName = schema.tableName;
        schema.columns.forEach(column => {
            this.columns.push({
                name: column.name,
                dataType: column.dataType,
                primary: !!column.primary
            });
        });
        this.columns = this.singularizePrimaryKey(this.columns);
    }
    singularizePrimaryKey(columns) {
        let primary = false;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].primary) {
                if (primary)
                    columns[i].primary = false;
                primary = true;
            }
        }
        return columns;
    }
    fields() {
        return this.columns.map(column => column.name);
    }
    types() {
        return this.columns.map(column => column.dataType);
    }
    oneHotPrimaryKeyArray() {
        return this.columns.map(column => column.primary);
    }
    formatObject(obj) {
        let result = {};
        let id = {};
        this.columns.forEach(column => {
            let val = obj[column.name];
            if (typeof val == 'object') {
                val = val.map(v => `${v}`).join(',');
            }
            result[column.name] = val;
        });
        return result;
    }
    formatRow(obj) {
        let info = this.columns.map(column => {
            column.value = obj[column.name];
            return column;
        });
        return info;
    }
    equals(array1, array2) {
        let a1 = array1.length, a2 = array2.length;
        if (a1 != a2)
            return false;
        for (let i = 0; i < a1; i++) {
            if (array1[i] != array2[i])
                return false;
        }
        return true;
    }
    save(item) {
        if (!item)
            return Promise.reject('Item is null');
        let itemKeys = Object.keys(item);
        if (this.equals(itemKeys, this.fields())) {
            let formattedItem = this.formatObject(item);
            let info = {
                tableName: this.tableName,
                columns: this.formatRow(formattedItem)
            };
            return this.db.create2(info);
        }
        return Promise.reject('Item properties are incorrect.');
    }
    findByPrimaryKey(id) {
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map
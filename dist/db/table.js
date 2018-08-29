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
                array: !!column.array,
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
    primaryKey() {
        let pk = this.columns.find(match => match.primary);
        return pk;
    }
    fields() {
        return this.columns.map(column => column.name);
    }
    oneHotPrimaryKeyArray() {
        return this.columns.map(column => column.primary);
    }
    formatObject(obj) {
        let result = {};
        this.columns.forEach(column => {
            let val = obj[column.name];
            if (column.array || typeof val == 'object') {
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
            return this.db.save2(info);
        }
        return Promise.reject('Item properties are incorrect.');
    }
    findById(id) {
        let pk = this.primaryKey();
        pk.value = id;
        return this.processRecordsets(this.db.findByColumn(this.tableName, pk));
    }
    pullAll() {
        return this.processRecordsets(this.db.pullAll(this.tableName));
    }
    deleteById(id) {
        let pk = this.primaryKey();
        pk.value = id;
        return this.processRecordsets(this.db.deleteByColumn(this.tableName, pk));
    }
    processRecordsets(result) {
        return result.then(resolved => {
            if (resolved.recordset && resolved.recordset.length > 0)
                return this.parseObjects(resolved.recordset);
            return [];
        }).catch(exception => []);
    }
    parseObjects(objs) {
        let result = [];
        objs.forEach(obj => {
            let parsedObj = {};
            let keys = Object.keys(obj);
            keys.forEach(key => {
                let index = this.columns.findIndex(match => match.name == key);
                if (index >= 0) {
                    if (this.columns[index].array) {
                        parsedObj[key] = this.splitField(obj[key]);
                    }
                    else
                        parsedObj[key] = obj[key];
                }
            });
            result.push(parsedObj);
        });
        return result;
    }
    splitField(merged) {
        return merged.split(',').filter((entry) => entry != '');
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map
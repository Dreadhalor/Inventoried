"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const durable_1 = require("./durable");
const consumable_1 = require("./consumable");
const db = require('./db');
//durables categories
const getDurablesCategories = exports.getDurablesCategories = () => {
    let query = '';
    return db.read('durablesCategories', query);
};
const setDurablesCategories = exports.setDurablesCategories = (categories) => {
    return db.dropTable('durablesCategories').then(resolve => {
        if (categories.length > 0) {
            let tableName = 'durablesCategories';
            let columnNames = ['id', 'value'];
            let dataTypes = ['varchar(max)', 'varchar(max)'];
            let rows = [];
            categories.forEach(pair => rows.push([pair.id, pair.value]));
            return db.bulkAddition(tableName, columnNames, dataTypes, rows);
        }
        return Promise.resolve(resolve);
    }, reject => Promise.reject(reject)).catch(exception => exception);
};
//consumables categories
const getConsumablesCategories = exports.getConsumablesCategories = () => {
    let query = '';
    return db.read('consumablesCategories', query);
};
const setConsumablesCategories = exports.setConsumablesCategories = (categories) => {
    return db.dropTable('consumablesCategories').then(resolve => {
        if (categories.length > 0) {
            let tableName = 'consumablesCategories';
            let columnNames = ['id', 'value'];
            let dataTypes = ['varchar(max)', 'varchar(max)'];
            let rows = [];
            categories.forEach(pair => rows.push([pair.id, pair.value]));
            return db.bulkAddition(tableName, columnNames, dataTypes, rows);
        }
        return Promise.resolve(resolve);
    }, reject => Promise.reject(reject)).catch(exception => exception);
};
//manufacturers
const getManufacturers = exports.getManufacturers = () => {
    let query = '';
    return db.read('manufacturers', query);
};
const setManufacturers = exports.setManufacturers = (manufacturers) => {
    return db.dropTable('manufacturers').then(resolve => {
        if (manufacturers.length > 0) {
            let tableName = 'manufacturers';
            let columnNames = ['id', 'value'];
            let dataTypes = ['varchar(max)', 'varchar(max)'];
            let rows = [];
            manufacturers.forEach(pair => rows.push([pair.id, pair.value]));
            return db.bulkAddition(tableName, columnNames, dataTypes, rows);
        }
        return Promise.resolve(resolve);
    }, reject => Promise.reject(reject)).catch(exception => exception);
};
//manufacturers
const getTags = exports.getTags = () => {
    let query = '';
    return db.read('tags', query);
};
const setTags = exports.setTags = (tags) => {
    return db.dropTable('tags').then(resolve => {
        if (tags.length > 0) {
            let tableName = 'tags';
            let columnNames = ['id', 'value'];
            let dataTypes = ['varchar(max)', 'varchar(max)'];
            let rows = [];
            tags.forEach(pair => rows.push([pair.id, pair.value]));
            return db.bulkAddition(tableName, columnNames, dataTypes, rows);
        }
        return Promise.resolve(resolve);
    }, reject => Promise.reject(reject)).catch(exception => exception);
};
//durables
const saveDurable = exports.saveDurable = (durable) => {
    let data = durable_1.Durable.sqlFieldsWithValues(durable);
    return db.create(data.tableName, data.fields, data.types, data.values, durable.id);
};
const getDurables = exports.getDurables = () => {
    let query = '';
    return db.read('durables', query);
};
const updateDurable = exports.updateDurable = (durable) => {
    let data = durable_1.Durable.sqlFieldsWithValues(durable);
    return db.update('durables', data.fields, data.types, data.values, [data.fields[0], data.types[0], data.values[0]]);
};
const deleteDurable = exports.deleteDurable = (id) => {
    return db.deleteItem('durables', id);
};
//consumables
const saveConsumable = exports.saveConsumable = (consumable) => {
    let data = consumable_1.Consumable.sqlFieldsWithValues(consumable);
    return db.create(data.tableName, data.fields, data.types, data.values, consumable.id);
};
const getConsumables = exports.getConsumables = () => {
    let query = '';
    return db.read('consumables', query);
};
const updateConsumable = exports.updateConsumable = (consumable) => {
    let data = consumable_1.Consumable.sqlFieldsWithValues(consumable);
    return db.update('consumables', data.fields, data.types, data.values, [data.fields[0], data.types[0], data.values[0]]);
};
const deleteConsumable = exports.deleteConsumable = (id) => {
    return db.deleteItem('consumables', id);
};
//# sourceMappingURL=db-client.js.map
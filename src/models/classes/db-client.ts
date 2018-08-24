import { IKeyValuePair } from './../interfaces/IKeyValuePair';
import { IConsumable } from './../interfaces/IConsumable';
import { Durable } from "./durable";
import { IDurable } from "../interfaces/IDurable";
import { Consumable } from './consumable';

const db = require('./db');

//durables categories
const getDurablesCategories = exports.getDurablesCategories = () => {
  let query = '';
  return db.read('durablesCategories',query);
}
const setDurablesCategories = exports.setDurablesCategories = (categories: IKeyValuePair[]): Promise<any> => {
  return db.dropTable('durablesCategories').then(
    resolve => {
      if (categories.length > 0){
        let tableName = 'durablesCategories';
        let columnNames = ['id', 'value'];
        let dataTypes = ['varchar(max)', 'varchar(max)'];
        let rows = [];
        categories.forEach(pair => rows.push([pair.id, pair.value]));
        return db.bulkAddition(tableName, columnNames, dataTypes, rows);
      }
      return Promise.resolve(resolve);
    },
    reject => Promise.reject(reject)
  ).catch(exception => exception);
}

//consumables categories
const getConsumablesCategories = exports.getConsumablesCategories = () => {
  let query = '';
  return db.read('consumablesCategories',query);
}
const setConsumablesCategories = exports.setConsumablesCategories = (categories: IKeyValuePair[]): Promise<any> => {
  return db.dropTable('consumablesCategories').then(
    resolve => {
      if (categories.length > 0){
        let tableName = 'consumablesCategories';
        let columnNames = ['id', 'value'];
        let dataTypes = ['varchar(max)', 'varchar(max)'];
        let rows = [];
        categories.forEach(pair => rows.push([pair.id, pair.value]));
        return db.bulkAddition(tableName, columnNames, dataTypes, rows);
      }
      return Promise.resolve(resolve);
    },
    reject => Promise.reject(reject)
  ).catch(exception => exception);
}

//manufacturers
const getManufacturers = exports.getManufacturers = () => {
  let query = '';
  return db.read('manufacturers',query);
}
const setManufacturers = exports.setManufacturers = (manufacturers: IKeyValuePair[]): Promise<any> => {
  return db.dropTable('manufacturers').then(
    resolve => {
      if (manufacturers.length > 0){
        let tableName = 'manufacturers';
        let columnNames = ['id', 'value'];
        let dataTypes = ['varchar(max)', 'varchar(max)'];
        let rows = [];
        manufacturers.forEach(pair => rows.push([pair.id, pair.value]));
        return db.bulkAddition(tableName, columnNames, dataTypes, rows);
      }
      return Promise.resolve(resolve);
    },
    reject => Promise.reject(reject)
  ).catch(exception => exception);
}

//manufacturers
const getTags = exports.getTags = () => {
  let query = '';
  return db.read('tags',query);
}
const setTags = exports.setTags = (tags: IKeyValuePair[]): Promise<any> => {
  return db.dropTable('tags').then(
    resolve => {
      if (tags.length > 0){
        let tableName = 'tags';
        let columnNames = ['id', 'value'];
        let dataTypes = ['varchar(max)', 'varchar(max)'];
        let rows = [];
        tags.forEach(pair => rows.push([pair.id, pair.value]));
        return db.bulkAddition(tableName, columnNames, dataTypes, rows);
      }
      return Promise.resolve(resolve);
    },
    reject => Promise.reject(reject)
  ).catch(exception => exception);
}

//durables
const saveDurable = exports.saveDurable = (durable: IDurable) => {
  let data = Durable.sqlFieldsWithValues(durable);
  return db.create(data.tableName, data.fields, data.types, data.values, durable.id);
}
const getDurables = exports.getDurables = () => {
  let query = '';
  return db.read('durables',query);
}
const updateDurable = exports.updateDurable = (durable: IDurable) => {
  let data = Durable.sqlFieldsWithValues(durable);
  return db.update('durables', data.fields, data.types, data.values, [data.fields[0], data.types[0], data.values[0]]);
}
const deleteDurable = exports.deleteDurable = (id: string) => {
  return db.deleteItem('durables',id);
}

//consumables
const saveConsumable = exports.saveConsumable = (consumable: IConsumable) => {
  let data = Consumable.sqlFieldsWithValues(consumable);
  return db.create(data.tableName, data.fields, data.types, data.values, consumable.id);
}
const getConsumables = exports.getConsumables = () => {
  let query = '';
  return db.read('consumables',query);
}
const updateConsumable = exports.updateConsumable = (consumable: IConsumable) => {
  let data = Consumable.sqlFieldsWithValues(consumable);
  return db.update('consumables', data.fields, data.types, data.values, [data.fields[0], data.types[0], data.values[0]]);
}
const deleteConsumable = exports.deleteConsumable = (id: string) => {
  return db.deleteItem('consumables',id);
}
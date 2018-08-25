import { IKeyValuePair } from './../interfaces/IKeyValuePair';
import { IConsumable } from './../interfaces/IConsumable';
import { Durable } from "./durable";
import { IDurable } from "../interfaces/IDurable";
import { Consumable } from './consumable';

const db = require('./db');

//durables categories
const getDurablesCategories = exports.getDurablesCategories = () => {
  return db.read('durablesCategories',null);
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
  return db.read('consumablesCategories',null);
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
  return db.read('manufacturers',null);
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
  return db.read('tags',null);
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
  return db.create(data.tableName, data.fields, data.types, formatObject(data.durable), durable.id);
}
const getDurables = exports.getDurables = () => {
  return db.read('durables',null).then(
    resolved => {
      let result = resolved.recordset;
      if (result) return result;
      else return [];
    }
  ).catch(exception => null);
}
const getDurable = exports.getDurable = (id: string) => {
  return db.read('durables',byId(id)).then(
    resolved => {
      if (!resolved || !resolved.recordset || resolved.recordset.length == 0)
        return null;
      return resolved.recordset[0];
    }
  ).catch(exception => null);
}
const updateDurable = exports.updateDurable = (durable: IDurable) => {
  let data = Durable.sqlFieldsWithValues(durable);
  let formattedDurable = formatObject(data.durable);
  return db.update('durables', data.fields, data.types, formattedDurable, [data.fields[0], data.types[0], formattedDurable[0]]);
}
const deleteDurable = exports.deleteDurable = (id: string) => {
  return db.deleteItem('durables',id);
}

//consumables
const saveConsumable = exports.saveConsumable = (consumable: IConsumable) => {
  let data = Consumable.sqlFieldsWithValues(consumable);
  return db.create(data.tableName, data.fields, data.types, formatObject(data.consumable), consumable.id);
}
const getConsumables = exports.getConsumables = () => {
  return db.read('consumables',null).then(
    resolved => {
      let result = resolved.recordset;
      if (result) return result;
      else return [];
    }
  ).catch(exception => null);
}
const getConsumable = exports.getConsumable = (id: string) => {
  return db.read('consumables',byId(id)).then(
    resolved => {
      if (!resolved || !resolved.recordset || resolved.recordset.length == 0)
        return null;
      return resolved.recordset[0];
    }
  ).catch(exception => null);
}
const updateConsumable = exports.updateConsumable = (consumable: IConsumable) => {
  let data = Consumable.sqlFieldsWithValues(consumable);
  let formattedConsumable = formatObject(data.consumable);
  return db.update('consumables', data.fields, data.types, formattedConsumable, [data.fields[0], data.types[0], formattedConsumable[0]]);
}
const deleteConsumable = exports.deleteConsumable = (id: string) => {
  return db.deleteItem('consumables',id);
}

//users
const getAssignmentIds = exports.getAssignmentIds = (userId: string) => {
  return db.read('userData',null).then(
    resolved => {
      if (resolved.recordset && resolved.recordset.assignmentIds)
        return resolved.recordset.assignmentIds;
      return [];
    }
  ).catch(exception => null);
}

//formatting
function byId(id: string){
  return `id = '${id}'`;
}
function formatObject(obj: object): any[]{
  let keys = Object.keys(obj);
  let result = [];
  keys.forEach((key) => {
    if (typeof obj[key] == 'object')
      result.push(obj[key].join(','));
    else result.push(obj[key]);
  });
  console.log(result);
  return result;
}
/*function parseFormattedObject(obj: any[], fields: string[], fieldsToSplit: string[]){
  let result: any =  {};
  fields.forEach(field => {
    if (fieldsToSplit.indexOf(field) >= 0)
      result[field] = entry[field];
  })
}
let fields = ['id', 'label', 'quantity', 'categoryId', 'manufacturerId', 'notes', 'assignmentIds', 'tagIds'];
    return iconsumables.map(entry => {
      let result: any =  {};
      fields.forEach(field => result[field] = entry[field]);
      result.tagIds = entry.tagIds.split(',');
      return result;
    })*/
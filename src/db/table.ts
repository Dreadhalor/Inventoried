import { ITableSchema } from '../models/interfaces/ITableSchema';
import * as fse from 'fs-extra';
import * as replace from 'replace-in-file';

export class Table {

  tableName: string;
  columns: any[] = [];
  db: any;

  constructor(db: any, schema: ITableSchema){
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
    this.createUpdateTrigger();
  }

  singularizePrimaryKey(columns: any[]){
    let primary = false;
    for (let i = 0; i < columns.length; i++){
      if (columns[i].primary){
        if (primary) columns[i].primary = false;
        primary = true;
      }
    }
    return columns;
  }
  primaryKey(){
    let pk = this.columns.find(match => match.primary);
    return pk;
  }

  fields(){
    return this.columns.map(column => column.name);
  }
  oneHotPrimaryKeyArray(){
    return this.columns.map(column => column.primary);
  }
  formatObject(obj: object){
    let result = {};
    this.columns.forEach(column => {
      let val = obj[column.name];
      if (column.dataType.includes('[]')){
        val = JSON.stringify(val);
      }
      result[column.name] = val;
    })
    return result;
  }
  formatRow(obj: object){
    let info = this.columns.map(column => {
      column.value = obj[column.name];
      return column;
    });
    return info;
  }

  equals(array1: string[], array2: string[]){
    let a1 = array1.length, a2 = array2.length;
    if (a1 != a2) return false;
    for (let i = 0; i < a1; i++){
      if (array1[i] != array2[i]) return false;
    }
    return true;
  }

  save(item){
    if (!item) return Promise.reject('Item is null');
    let itemKeys = Object.keys(item);
    if (this.equals(itemKeys, this.fields())){
      let formattedItem = this.formatObject(item);
      let info = {
        tableName: this.tableName,
        columns: this.formatRow(formattedItem)
      }
      return this.processRecordsets(this.db.save2(info));
    } return Promise.reject('Item properties are incorrect.');
  }
  findById(id: string){
    let pk = this.primaryKey();
    pk.value = id;
    return this.processRecordsets(this.db.findByColumn(this.tableName, pk));
  }
  pullAll(){
    return this.processRecordsets(this.db.pullAll(this.tableName));
  }
  deleteById(id: string){
    let pk = this.primaryKey();
    pk.value = id;
    return this.processRecordsets(this.db.deleteByColumn(this.tableName, pk));
  }

  processRecordsets(result: any){
    return result.then(
      resolved => {
        if (resolved.recordset && resolved.recordset.length > 0){
          return this.parseObjects(resolved.recordset);
        }
        return [];
      }
    ).catch(exception => [])
  }
  parseObjects(objs: object[]){
    let result = [];
    objs.forEach(obj => {
      let parsedObj = {};
      let keys = Object.keys(obj)
      keys.forEach(key => {
        let found = this.columns.find(match => match.name == key);
        if (found){
          let str = found.dataType.includes('[]');
          if (str) parsedObj[key] = JSON.parse(obj[key]);
          else parsedObj[key] = obj[key];
        }
      })
      result.push(parsedObj);
    })
    return result; 
  }

  createUpdateTrigger(){
    let triggerName = `update_trigger_${this.tableName}`;
    let destDirectory = `src/db/scripts/generated/tables/${this.tableName}`;
    let destFile = `${triggerName}.sql`;
    let destPath = `${destDirectory}/${destFile}`;
    fse.remove(destDirectory).then(
      (removed) => fse.copy(
        'src/db/scripts/templates/update_trigger.sql',
        destPath
      )
    ).then(
      success => {
        const options = {
          files: destPath,
          from: [
            /<database_name>/g,
            /<table_name>/g,
            /<trigger_name>/g
          ],
          to: [
            this.db.databaseName,
            this.tableName,
            triggerName
          ]
        };
        return replace(options);
      }
    ).catch(exception => console.log(exception));
  }

}
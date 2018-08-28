import { ITableSchema } from '../models/interfaces/ITableSchema';

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

  fields(){
    return this.columns.map(column => column.name);
  }
  types(){
    return this.columns.map(column => column.dataType);
  }
  oneHotPrimaryKeyArray(){
    return this.columns.map(column => column.primary);
  }
  formatObject(obj: object){
    let result = {};
    let id = {};
    this.columns.forEach(column => {
      let val = obj[column.name];
      if (typeof val == 'object'){
        val = val.map(v => `${v}`).join(',');
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
      return this.db.create2(info);
    } return Promise.reject('Item properties are incorrect.');
  }
  findByPrimaryKey(id: string){

  }

}
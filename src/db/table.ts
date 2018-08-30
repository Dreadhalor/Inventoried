import { ITableSchema } from '../models/interfaces/ITableSchema';

export class Table {

  delimiter = String.fromCharCode(156);

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
      if (typeof val == 'object'){
        val = Buffer.from(val.map(v => `${v}`).join(this.delimiter));
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
        if (Buffer.isBuffer(obj[key])) parsedObj[key] = this.parseBuffer(obj[key]);
        else parsedObj[key] = obj[key];
      })
      result.push(parsedObj);
    })
    return result; 
  }
  parseBuffer(buffer: Buffer){
    let split = buffer.toString().split(this.delimiter).filter((entry) => entry != '');
    return split;
  }

}
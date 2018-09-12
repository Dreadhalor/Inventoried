import { Subject } from 'rxjs';
import { ITableSchema } from '../models/interfaces/ITableSchema';
import * as fse from 'fs-extra';
import * as replace from 'replace-in-file';

export class Table {

  tableName: string;
  columns: any[] = [];
  db: any;
  public update = new Subject<any>();

  srcPaths = {
    createTable: 'src/db/scripts/templates/create_table.template.sql',
    createUpdateTrigger: 'src/db/scripts/templates/update_trigger.template.sql',
    saveQuery: 'src/db/scripts/templates/save.template.sql'
  }
  get destDirs(){
    return {
      createTable: `src/db/scripts/generated/tables/${this.tableName}`,
      createUpdateTrigger: `src/db/scripts/generated/tables/${this.tableName}`,
      saveQuery: `src/db/scripts/generated/tables/${this.tableName}`
    }
  }
  get destFiles(){
    return {
      createTable: `create_table_${this.tableName}.sql`,
      createUpdateTrigger: `update_trigger_${this.tableName}.sql`,
      saveQuery: `save_${this.tableName}.sql`
    }
  }

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
    db.onConnected(() => this.constructTable());
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
  formatObject(obj: object): any {
    let result = {};
    this.columns.forEach(column => {
      let val = obj[column.name];
      if (this.shouldStringify(column)){
        val = JSON.stringify(val);
      }
      result[column.name] = val;
    })
    return result;
  }
  formatRow(obj: any){
    let columns = this.columns.map(column => {
      //DEEP COPYING NECESSARY FOR CLOSELY-SPACED EDITS
      column = Table.deepCopy(column);
      column.value = obj[column.name];
      return column;
    });
    return columns;
  }
  tableInfo(){
    return {
      tableName: this.tableName,
      columns: this.columns.map(column => Table.deepCopy(column))
    };
  }

  equals(array1: string[], array2: string[]){
    let a1 = array1.length, a2 = array2.length;
    if (a1 != a2) return false;
    for (let i = 0; i < a1; i++){
      if (array1[i] != array2[i]) return false;
    }
    return true;
  }

  save(item, agent?, singular = true){
    if (!item) return Promise.reject('Item is null');
    let itemKeys = Object.keys(item);
    if (this.equals(itemKeys, this.fields())){
      let formattedItem = this.formatObject(item)
      let info = {
        tableName: this.tableName,
        columns: this.formatRow(formattedItem)
      };
      return fse.readFile(`src/db/scripts/generated/tables/${this.tableName}/save_${this.tableName}.sql`,'utf8')
      .then(file => this.db.prepareQueryAndExecute(file,info))
      .then(executed => this.processRecordsets(executed))
      .then(processed => {
        let result;
        if (processed.length > 1)
          result = {
            table: this.tableName,
            operation: 'update',
            deleted: processed[0],
            inserted: processed[1]
          }
        else result = {
          table: this.tableName,
          operation: 'create',
          inserted: processed[0]
        };
        if (singular){
          if (agent) result.agent = agent;
          this.update.next(result);
        }
        return result;
      })
    } return Promise.reject('Item properties are incorrect.');
  }
  saveBulk(items, agent?){
    if (!items) return Promise.reject('Item is null');
    items = items.map(item => {
      let itemKeys = Object.keys(item);
      if (this.equals(itemKeys, this.fields()))
        return this.formatObject(item)
      else throw 'All items must be correctly formatted.';
    })
    return this.db.bulkAddition2(this.tableInfo(), items)
      .then(result => {
        console.log(result);
        return result;
      });
    
  }
  findById(id: string){
    let pk = this.primaryKey();
    pk.value = id;
    return this.db.findByColumn(this.tableName, pk)
      .then(found => this.processRecordsets(found)[0]);
  }
  pullAll(){
    return this.db.pullAll(this.tableName)
      .then(pulled => this.processRecordsets(pulled));
  }
  deleteById(id: string, agent?){
    let pk = this.primaryKey();
    pk.value = id;
    return this.db.deleteByColumn(this.tableName, pk)
      .then(deleted => this.processRecordsets(deleted))
      .then(processed => {
        let result: any = {
          table: this.tableName,
          operation: 'delete',
          deleted: processed[0]
        };
        if (agent) result.agent = agent;
        this.update.next(result);
        return result;
      })
  }

  processRecordsets(result){
    if (result &&
        result.recordset &&
        result.recordset.length > 0)
        return this.parseObjects(result.recordset);
    return [];
  }
  shouldStringify(column){
    return column.dataType.includes('[]') || column.dataType == 'object';
  }
  parseObjects(objs: object[]){
    let result = [];
    objs.forEach(obj => {
      let parsedObj = {};
      let keys = Object.keys(obj)
      keys.forEach(key => {
        let found = this.columns.find(match => match.name == key);
        if (found){
          if (this.shouldStringify(found)) parsedObj[key] = JSON.parse(obj[key]);
          else parsedObj[key] = obj[key];
        }
      })
      result.push(parsedObj);
    })
    return result; 
  }

  constructTable(){
    let srcPath = this.srcPaths.createTable;
    let destDirectory = this.destDirs.createTable;
    let destFile = this.destFiles.createTable;
    let destPath = `${destDirectory}/${destFile}`
    let args = '';
    this.columns.forEach((column, index) => {
      args += `[${column.name}] ${this.db.parseDataType(column.dataType, true)}`
      if (index < this.columns.length - 1) args += `,\n\t\t`;
    })
    let substitutionOptions = {
      files: destPath,
      from: [
        /<database_name>/g,
        /<table_name>/g,
        /<args>/g
      ],
      to: [
        this.db.databaseName,
        this.tableName,
        args
      ]
    };
    
    fse.ensureDir(destDirectory)
      .then(directory => fse.emptyDir(destDirectory))
      .then(emptied => fse.copy(srcPath, destPath))
      .then(success => replace(substitutionOptions))
      .then(replaced => fse.readFile(destPath,'utf8'))
      .then(query => this.db.executeQueryAsPreparedStatement(query))
      .then(tableCreated => Promise.all([
          this.createUpdateTrigger(),
          this.createSaveQuery()
        ])
      )
      .catch(exception => console.log(exception));
  }
  createUpdateTrigger(){
    let triggerName = `update_trigger_${this.tableName}`;
    let srcPath = this.srcPaths.createUpdateTrigger;
    let destDirectory = this.destDirs.createUpdateTrigger;
    let destFile = this.destFiles.createUpdateTrigger;
    let destPath = `${destDirectory}/${destFile}`;
    let substitutionOptions = {
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

    return fse.copy(srcPath, destPath)
      .then(success => replace(substitutionOptions))
      .then(replaced => fse.readFile(destPath,'utf8'))
      .then(query => this.db.executeQueryAsPreparedStatement(query))
  }
  createSaveQuery(){
    let srcPath = this.srcPaths.saveQuery;
    let destDirectory = this.destDirs.saveQuery;
    let destFile = this.destFiles.saveQuery;
    let destPath = `${destDirectory}/${destFile}`;
    let args = '', fields = '', values = '';
    this.columns.forEach((column, index) => {
      let primary = this.columns[index].primary;
      if (!primary) args += `[${column.name}] = @${column.name}`;
      fields += `[${column.name}]`;
      values += `@${column.name}`;
      if (index < this.columns.length - 1){
        if (!primary) args += `,\n\t`;
        fields += `,\n\t\t`;
        values += `,\n\t\t`;
      }
    })
    let substitutionOptions = {
      files: destPath,
      from: [
        /<database_name>/g,
        /<table_name>/g,
        /<args>/g,
        /<fields>/g,
        /<values>/g,
        /<primary>/g
      ],
      to: [
        this.db.databaseName,
        this.tableName,
        args,
        fields,
        values,
        this.primaryKey().name
      ]
    };

    return fse.copy(srcPath, destPath)
      .then(success => replace(substitutionOptions));
  }

  public static deepCopy(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

}
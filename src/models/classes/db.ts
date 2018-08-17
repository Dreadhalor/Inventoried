import { Durable } from './durable';
import { IDurable } from './../interfaces/IDurable';
const sql = require('mssql/msnodesqlv8')

let pool = null;

exports.connect = (config) =>
  pool = new sql.ConnectionPool(config,
    (err) => {
      //Error handling goes here
      if (err) return err;
      return true;
    }
  );

exports.Schema = (fields: any) => {
  let columns = Object.keys(fields);
  //console.log(columns);
  let fieldFormats = columns.map(key => [key,fields[key].toString()]);
  //console.log(fieldFormats);
  return fieldFormats;
}

const saveDurable = exports.saveDurable = (durable: IDurable) => {
  let checkData = Durable.sqlFields();
  return new Promise((resolve, reject) => {
    return createTableIfNotExists(checkData[0] as string, checkData[1] as string[], checkData[2] as string[]).then(
      resolved => {
        let addData = Durable.sqlFieldsWithValues(Durable.formatDurable(durable));
        return add(addData[0],addData[1],addData[2]);
      },
      rejected => {
        console.log('rejected');
        return rejected;
      }
    ).catch(exception => exception)
  })
}

exports.model = (tableName: string, fields: string[][]) => {
  //return createTable(tableName,fields);
  return add(tableName, ['field1', 'field2', 'field3'], ['val1', 'val2', 'val3']);
}

const doesTableExist = exports.doesTableExist = (tableName: string) => {
  let query = `select case when exists ` +
    `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
    `then cast(1 as bit) else cast(0 as bit) end`;
  return executeQuery(query).then(
    (resolve: any) => resolve.recordset[0][''],
    reject => false
  );
}

function createTable(tableName: string, fields: string[][]){
  let fieldsString = '';
    fields.forEach((pair, index) => {
      fieldsString += `${pair[0]} ${pair[1]}`;
      if (index < fields.length - 1) fieldsString += ', ';
    });
  return executeQuery(`create table "${tableName}" (${fieldsString});`);
}
const createTableIfNotExists = exports.createTableIfNotExists = (tableName: string, fields: string[], types: string[]) => {
  let query = `if not exists ` + 
    `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
    `begin create table "${tableName}" ${formatArgs(pairArgs(fields,types))} end`;
  return executeQuery(query);
}

function add(tableName, fields, values){
  let query = `insert into "${tableName}" ${formatArgs(fields)} ${formatArgs(values)}`;
  console.log(query);
  return executeQuery(query);
}

function pairArgs(args1: string[], args2: string[]){
  let pairs = args1.map((arg, index) => `${arg} ${args2[index]}`);
  return pairs;
}
function formatArgs(args: string[]){
  let argsString = '(';
  args.forEach((arg, index) => {
    argsString += `${arg}`;
    if (index < args.length - 1) argsString += ', '
    else argsString += ')';
  });
  return argsString;
}

function executeQuery(query){
  return new Promise((resolve,reject) => {
    try {
      const transaction = new sql.Transaction(pool);
      transaction.begin(err1 => {
        if (err1) reject(err1);
        let request = new sql.Request(transaction);
        request.query(query, (err2, result) => {
          if (err2) reject(err2);
          transaction.commit(err3 => {
            if (err3) reject(err3);
            resolve(result);
          })
        })
      })
    } catch (err4) {reject(err4);}
  });
}
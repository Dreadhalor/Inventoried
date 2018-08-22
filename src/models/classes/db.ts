import { Durable } from './durable';
import { IDurable } from './../interfaces/IDurable';
const sql = exports.sql = require('mssql/msnodesqlv8');
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
  let data = Durable.sqlFieldsWithValues(durable);
  //console.log(data);
  //return insertValues(data.tableName, data.fields, data.types, data.values);
  return create(data.tableName, data.fields, data.types, data.values, durable.id);
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

function add(tableName, fields, values){
  let query = `insert into "${tableName}" ${formatArgs(fields,`"`)} ${formatArgs(values,`'`)}`;
  console.log(query);
  return executeQuery(query);
}

function pairArgs(args1: string[], args2: string[]){
  //console.log(args1);
  let pairs = args1.map((arg, index) => `${arg} ${args2[index]}`);
  return pairs;
}
function formatArgs(args: string[], delimiter: string){
  let argsString = '(';
  args.forEach((arg, index) => {
    argsString += `${delimiter}${arg}${delimiter}`;
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

const formatCreateTableIfNotExists = (tableName: string, fields: string[], types: string[]) => {
  let query =
    `if not exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}')
    begin
      create table "${tableName}" ${formatArgs(pairArgs(fields,types),'')}
    end;`;
  return query;
}
const formatInsertValuesIfNotDuplicate = (tableName: string, values: any[], id: any) => {
  let query =
  `if not exists (select * from ${tableName} where id = '${id}')
  begin
    ${formatInsertValuesPrepareString(tableName,values)}
  end;`;
  return query;
}
const formatInsertValuesPrepareString = (tableName: string, values: any[]) => {
  let paramCount = values.length;
  let query = `insert into "${tableName}" values (`;
  for (let i = 1; i <= paramCount; i++) {
    query += `@value${i}`;
    if (i < paramCount) query += `, `;
  };
  query += `);`
  return query;
}
const preparedStatementWithInputs = (types: string[]) => {
  const ps = new sql.PreparedStatement(pool);
  for (let i = 0; i < types.length; i++){
    ps.input(`value${i+1}`,parseDataType(types[i]));
  }
  return ps;
}
const parseDataType = (type: string) => {
  switch (type){
    case 'varchar(max)': return sql.VarChar(sql.MAX);
    case 'bit': return sql.Bit;
  }
}
const create = (tableName: string, fields: string[], types: string[], values: any[], id: any) => {
  return new Promise((resolve, reject) => {
    let createTable = formatCreateTableIfNotExists(tableName, fields, types);
    let insertValues = (id) ? formatInsertValuesIfNotDuplicate(tableName, values, id) : formatInsertValuesPrepareString(tableName, values);
    let prepString = `${createTable} ${insertValues}`;
    const ps = preparedStatementWithInputs(types);
    ps.prepare(prepString, err => {
      if (err) reject(err);
      let formattedValues = [];
      values.forEach((value,index) => { formattedValues[`value${index+1}`] = value; });
      ps.execute(formattedValues, (err, result) => {
        if (err) reject(err);
        ps.unprepare(err => {
          if (err) reject(err);
          resolve(result);
        })
      })
    })
  })
}

//read
//update
//delete
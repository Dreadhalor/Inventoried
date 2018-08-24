import { Durable } from './durable';
import { IDurable } from './../interfaces/IDurable';
import { exec } from 'child_process';
const sql = require('mssql/msnodesqlv8');
let pool = null;

exports.connect = (config) =>
  pool = new sql.ConnectionPool(config,
    (err) => {
      //Error handling goes here
      if (err) return err;
      return true;
    }
  );

const doesTableExist = exports.doesTableExist = (tableName: string) => {
  let query = `select case when exists ` +
    `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
    `then cast(1 as bit) else cast(0 as bit) end`;
  return executeQuery(query).then(
    (resolve: any) => resolve.recordset[0][''],
    reject => false
  );
}

function pairArgs(args1: string[], args2: string[]){
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

const bulkAddition = exports.bulkAddition = (tableName: string, columnNames: string[], dataTypes: string[], rows: any[][]) => {
  return new Promise((resolve, reject) => {
    const table = new sql.Table(tableName);
    table.create = true;
    columnNames.forEach((column, index) => {
      table.columns.add(column, parseDataType(dataTypes[index]), {nullable: false});
    })
    rows.forEach(row => {
      let [x, ...remaining] = row;
      table.rows.add(x, ...remaining);
    })
    const request = new sql.Request(pool);
    request.bulk(table, (err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

const formatIfTableExists = (tableName: string, innerQuery: string, exists: boolean) => {
  let query =
    `if ${exists ? `` : `not `}exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}')
    begin
      ${innerQuery}
    end;`;
  return query;
}
const formatCreateTable = (tableName: string, fields: string[], types: string[]) => {
  let query = `create table "${tableName}" ${formatArgs(pairArgs(fields,types),'')}`;
  return query;
}
const formatCreateTableIfNotExists = (tableName: string, fields: string[], types: string[]) => {
  let query = formatCreateTable(tableName, fields, types);
  query = formatIfTableExists(tableName, query, false);
  return query;
}

const formatDropTableIfExists = (tableName: string) => {
  let innerQuery = `drop table ${tableName};`;
  let query = formatIfTableExists(tableName, innerQuery, true);
  return query;
}

const formatIfNotDuplicate = (tableName: string, innerQuery: string, id: any) => {
  let query =
    `if not exists (select * from ${tableName} where id = '${id}')
    begin
      ${innerQuery};
    end;`;
  return query;
}
const formatInsertValues = (tableName: string, values: any[]) => {
  return formatInsertValuesPrepareString(tableName, values);
}
const formatInsertValuesIfNotDuplicate = (tableName: string, values: any[], id: any) => {
  let query = formatInsertValues(tableName, values);
  query = formatIfNotDuplicate(tableName, query, id);
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

const formatUpdateValuesPrepareString = (tableName: string, fields: string[]) => {
  let paramCount = fields.length;
  let query = `update "${tableName}" set `;
  for (let i = 1; i < paramCount; i++) {
    query += `${fields[i]} = @value${i}`;
    if (i < paramCount - 1) query += `, `;
  };
  query += ` where id = @id;`;
  return query;
}
const preparedStatementWithInputs = (types: string[]) => {
  const ps = new sql.PreparedStatement(pool);
  for (let i = 0; i < types.length; i++){
    ps.input(`value${i+1}`,parseDataType(types[i]));
  }
  return ps;
}
const executePreparedStatement = (ps: any, str: string, vals: object) => {
  return new Promise((resolve, reject) => {
    ps.prepare(str, err => {
      if (err) reject(err);
        ps.execute(vals, (err, result) => {
        if (err) reject(err);
        ps.unprepare(err => {
          if (err) reject(err);
          resolve(result);
        })
      })
    })
  })
}
const formatValues = (values: any[]): any => {
  let formattedValues = [];
  values.forEach((value,index) => { formattedValues[`value${index+1}`] = value; });
  return formattedValues;
}
const parseDataType = (type: string) => {
  switch (type){
    case 'varchar(max)': return sql.VarChar(sql.MAX);
    case 'bit': return sql.Bit;
    case 'int': return sql.Int;
  }
}
const create = exports.create = (tableName: string, fields: string[], types: string[], values: any[], id: any) => {
  let createTable = formatCreateTableIfNotExists(tableName, fields, types);
  let insertValues = (id) ? formatInsertValuesIfNotDuplicate(tableName, values, id) : formatInsertValuesPrepareString(tableName, values);
  let prepString = `${createTable} ${insertValues}`;
  const ps = preparedStatementWithInputs(types);
  let formattedValues = formatValues(values);
  return executePreparedStatement(ps, prepString, formattedValues);
}
const read = exports.read = (tableName: string, query: string) => {
  let innerQuery = `select * from ${tableName}${query ? ` where ${query}` : ``};`;
  let result = formatIfTableExists(tableName, innerQuery, true);
  return executeQuery(result);
}
const update = exports.update = (tableName: string, fields: string[], types: string[], values: any[], idVals: any[]) => {
  let prepString = formatUpdateValuesPrepareString(tableName, fields);
  let prepTypes = types.slice(1);
  let prepVals = values.slice(1);
  let ps = preparedStatementWithInputs(prepTypes);
  ps.input('id',parseDataType(idVals[1]));
  let formattedValues = formatValues(prepVals);
  formattedValues.id = idVals[2];
  return executePreparedStatement(ps, prepString, formattedValues);
}
const deleteItem = exports.deleteItem = (tableName: string, id: any) => {
  return executeQuery(`delete from ${tableName} where id = '${id}'`);
}
const dropTable = exports.dropTable = (tableName: string) => {
  let query = formatDropTableIfExists(tableName);
  return executeQuery(query);
}
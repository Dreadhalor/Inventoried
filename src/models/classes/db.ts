import { Durable } from './durable';
import { IDurable } from './../interfaces/IDurable';
const sql = require('mssql/msnodesqlv8')

let pool = null;

let table;

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
  //return insertValues(data.tableName, data.fields, data.types, data.values);
  insert(data.tableName, data.fields, data.types, data.values);
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
    `begin create table "${tableName}" ${formatArgs(pairArgs(fields,types),'')} end`;
  return executeQuery(query);
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

const insertValues = (tableName: string, fields: string[], types: string[], values: string[]) => {
  let createTable = formatCreateTableIfNotExists(tableName, fields, types);
  let insert = formatInsertValues(tableName, fields, values);
  let query = `${createTable}\n${insert}`;
  console.log(query);
  return executeQuery(query);
}

const formatCreateTableIfNotExists = (tableName: string, fields: string[], types: string[]) => {
  //prepareCreateTableIfNotExists(tableName, fields, types);
  let query = `if not exists\n` + 
    `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}')\n` +
    `begin\n\tcreate table "${tableName}" ${formatArgs(pairArgs(fields,types),'')}\nend;`;
  return query;
}
const prepareCreateTableIfNotExists = (tableName: string, fields: string[], types: string[]) => {
  const ps = new sql.PreparedStatement();
  ps.prepare(`if not exists ` + 
    `(select * from INFORMATION_SCHEMA.TABLES where ` + 
    `TABLE_NAME = @tableName) ` +
    `begin create table @tableName `, err => {
      console.log(err);
    });
}

  /*console.log(sql.VarChar(sql.MAX));
  //console.log(formattedIDurable);
  const ps = new sql.PreparedStatement(pool);
  ps.input('id',sql.VarChar(sql.MAX));
  ps.input('serialNumber',sql.VarChar(sql.MAX));
  ps.input('categoryId',sql.VarChar(sql.MAX));
  ps.input('manufacturerId',sql.VarChar(sql.MAX));
  ps.input('notes',sql.VarChar(sql.MAX));
  ps.input('assignmentId',sql.VarChar(sql.MAX));
  ps.input('tagIds',sql.VarChar(sql.MAX));
  ps.input('active',sql.Bit);
  console.log(ps);
  ps.prepare(insertDurableStatement, err => {
    if (err){
      console.log('one---------------------');
      console.log(err);
    }
    else {
      ps.execute(formattedIDurable, (err, result) => {
        if (err){
          console.log('two---------------------');
          console.log(err);
        }
        else if (result){
          ps.unprepare(err => {
            if (err){
              console.log('three---------------------');
              console.log(err);
            }
            return result;
          })
          return result;
        }
        else console.log('oh no');
      })
    }
  })
}*/
const formatInsertValues = (tableName: string, fields: string[], values: string[]) => {
    let query = `insert into "${tableName}"\n${formatArgs(fields,`"`)}\nvalues ${formatArgs(values,`'`)};`;
    return query;
}

const insert = (tableName: string, fields: string[], types: string[], values: string[]) => {
  //console.log(tableName);
  //console.log(fields);
  //console.log(types);
  //console.log(values);
  let paramCount = fields.length;
  let requestStr = `if not exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = @tableName)
  begin create table @tableName (`;
  for (let i = 1; i <= paramCount; i++) {
    requestStr += `@field${i}`;
    if (i < paramCount) requestStr += `, `;
  };
  requestStr += `) end;`/* insert into @tableName values (`;
  for (let i = 1; i <= paramCount; i++) {
    requestStr += `@value${i}`;
    if (i < paramCount) requestStr += `, `;
  };
  requestStr += `);`*/
  //console.log(requestStr);

  const request = new sql.Request(pool);
  request.input('tableName',tableName);
  /*for (let i = 1; i <= paramCount; i++) {
    request.input(`field${i}`,`${fields[i]} ${types[i]}`);
    request.input(`value${i}`,`${values[i]}`);
  };*/
  //console.log(request);
  request.query(requestStr, (err, result) => {
    if (err){
      console.log(err);
      return err;
    }
    //console.log(result);
    return result;
  })
}

const insertDurableStatement = `if not exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'durables')
begin create table durables (
  id varchar(max),
  serialNumber varchar(max),
  categoryId varchar(max),
  manufacturerId varchar(max),
  notes varchar(max),
  assignmentId varchar(max),
  tagIds varchar(max),
  active bit
) end;
insert into durables values (@id, @serialNumber, @categoryId, @manufacturerId, @notes, @assignmentId, @tagIds, @active)`;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const durable_1 = require("./durable");
const sql = require('mssql/msnodesqlv8');
let pool = null;
exports.connect = (config) => pool = new sql.ConnectionPool(config, (err) => {
    //Error handling goes here
    if (err)
        return err;
    return true;
});
exports.Schema = (fields) => {
    let columns = Object.keys(fields);
    //console.log(columns);
    let fieldFormats = columns.map(key => [key, fields[key].toString()]);
    //console.log(fieldFormats);
    return fieldFormats;
};
const saveDurable = exports.saveDurable = (durable) => {
    let checkData = durable_1.Durable.sqlFields();
    return new Promise((resolve, reject) => {
        return createTableIfNotExists(checkData[0], checkData[1], checkData[2]).then(resolved => {
            let addData = durable_1.Durable.sqlFieldsWithValues(durable_1.Durable.formatDurable(durable));
            return add(addData[0], addData[1], addData[2]);
        }, rejected => {
            console.log('rejected');
            return rejected;
        }).catch(exception => exception);
    });
};
exports.model = (tableName, fields) => {
    //return createTable(tableName,fields);
    return add(tableName, ['field1', 'field2', 'field3'], ['val1', 'val2', 'val3']);
};
const doesTableExist = exports.doesTableExist = (tableName) => {
    let query = `select case when exists ` +
        `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
        `then cast(1 as bit) else cast(0 as bit) end`;
    return executeQuery(query).then((resolve) => resolve.recordset[0][''], reject => false);
};
function createTable(tableName, fields) {
    let fieldsString = '';
    fields.forEach((pair, index) => {
        fieldsString += `${pair[0]} ${pair[1]}`;
        if (index < fields.length - 1)
            fieldsString += ', ';
    });
    return executeQuery(`create table "${tableName}" (${fieldsString});`);
}
const createTableIfNotExists = exports.createTableIfNotExists = (tableName, fields, types) => {
    let query = `if not exists ` +
        `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
        `begin create table "${tableName}" ${formatArgs(pairArgs(fields, types))} end`;
    return executeQuery(query);
};
function add(tableName, fields, values) {
    let query = `insert into "${tableName}" ${formatArgs(fields)} ${formatArgs(values)}`;
    console.log(query);
    return executeQuery(query);
}
function pairArgs(args1, args2) {
    let pairs = args1.map((arg, index) => `${arg} ${args2[index]}`);
    return pairs;
}
function formatArgs(args) {
    let argsString = '(';
    args.forEach((arg, index) => {
        argsString += `${arg}`;
        if (index < args.length - 1)
            argsString += ', ';
        else
            argsString += ')';
    });
    return argsString;
}
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        try {
            const transaction = new sql.Transaction(pool);
            transaction.begin(err1 => {
                if (err1)
                    reject(err1);
                let request = new sql.Request(transaction);
                request.query(query, (err2, result) => {
                    if (err2)
                        reject(err2);
                    transaction.commit(err3 => {
                        if (err3)
                            reject(err3);
                        resolve(result);
                    });
                });
            });
        }
        catch (err4) {
            reject(err4);
        }
    });
}
//# sourceMappingURL=db.js.map
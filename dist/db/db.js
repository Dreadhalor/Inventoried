const sql = require('mssql/msnodesqlv8');
const fse = require('fs-extra');
const replace = require('replace-in-file');
let databaseName = exports.databaseName;
module.exports.connect = (config) => {
    setDatabaseName(config.database);
    let destDirectory = `src/db/scripts/generated/database`;
    let destFile = `create_database_${databaseName}.sql`;
    let destPath = `${destDirectory}/${destFile}`;
    let srcPath = 'src/db/scripts/templates/create_database.sql';
    const substitutionOptions = {
        files: destPath,
        from: /<database_name>/g,
        to: databaseName
    };
    config.database = 'master';
    return sql.connect(config)
        .then(connected => fse.ensureDir(destDirectory))
        .then(directory => fse.emptyDir(destDirectory))
        .then(emptied => fse.copy(srcPath, destPath))
        .then(copied => replace(substitutionOptions))
        .then(replaced => fse.readFile(destPath, 'utf8'))
        .then(query => executeQueryAsPreparedStatement(query))
        .then(dbExists => {
        config.database = databaseName;
        return sql.close().then(sql.connect(config));
    });
};
const setDatabaseName = (name) => {
    databaseName = name;
    exports.databaseName = databaseName;
};
const doesTableExist = exports.doesTableExist = (tableName) => {
    let query = `select case when exists ` +
        `(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}') ` +
        `then cast(1 as bit) else cast(0 as bit) end`;
    return executeQuery(query).then((resolve) => resolve.recordset[0][''], reject => false);
};
function pairArgs(args1, args2) {
    let pairs = args1.map((arg, index) => `${arg} ${args2[index]}`);
    return pairs;
}
function formatArgs(args, delimiter) {
    let argsString = '(';
    args.forEach((arg, index) => {
        argsString += `${delimiter}${arg}${delimiter}`;
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
            const transaction = new sql.Transaction();
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
const bulkAddition = exports.bulkAddition = (tableName, columnNames, dataTypes, rows) => {
    return new Promise((resolve, reject) => {
        const table = new sql.Table(tableName);
        table.create = true;
        columnNames.forEach((column, index) => {
            table.columns.add(column, parseDataType(dataTypes[index], false), { nullable: false });
        });
        rows.forEach(row => {
            let [x, ...remaining] = row;
            table.rows.add(x, ...remaining);
        });
        const request = new sql.Request();
        request.bulk(table, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
const formatIfTableExists = (tableName, innerQuery, exists) => {
    let query = `if ${exists ? `` : `not `}exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${tableName}')
    begin
      ${innerQuery}
    end;`;
    return query;
};
const formatCreateTable = (tableName, fields, types) => {
    let query = `create table "${tableName}" ${formatArgs(pairArgs(fields, types), '')}`;
    return query;
};
const formatCreateTableIfNotExists = (tableName, fields, types) => {
    let query = formatCreateTable(tableName, fields, types);
    query = formatIfTableExists(tableName, query, false);
    return query;
};
const formatDropTableIfExists = (tableName) => {
    let innerQuery = `drop table ${tableName};`;
    let query = formatIfTableExists(tableName, innerQuery, true);
    return query;
};
const formatIfNotDuplicate = (tableName, innerQuery, id) => {
    let query = `if not exists (select * from ${tableName} where id = '${id}')
    begin
      ${innerQuery};
    end;`;
    return query;
};
const formatInsertValues = (tableName, values) => {
    return formatInsertValuesPrepareString(tableName, values);
};
const formatInsertValuesIfNotDuplicate = (tableName, values, id) => {
    let query = formatInsertValues(tableName, values);
    query = formatIfNotDuplicate(tableName, query, id);
    return query;
};
const formatInsertValuesPrepareString = (tableName, values) => {
    let paramCount = values.length;
    let query = `insert into "${tableName}" values (`;
    for (let i = 1; i <= paramCount; i++) {
        query += `@value${i}`;
        if (i < paramCount)
            query += `, `;
    }
    ;
    query += `);`;
    return query;
};
const formatUpdateValuesPrepareString = (tableName, fields) => {
    let paramCount = fields.length;
    let query = `update "${tableName}" set `;
    for (let i = 1; i < paramCount; i++) {
        query += `${fields[i]} = @value${i}`;
        if (i < paramCount - 1)
            query += `, `;
    }
    ;
    query += ` where id = @id;`;
    return query;
};
const preparedStatementWithInputs = (types) => {
    const ps = new sql.PreparedStatement();
    for (let i = 0; i < types.length; i++) {
        ps.input(`value${i + 1}`, parseDataType(types[i], false));
    }
    return ps;
};
const executeQueryAsPreparedStatement = (query) => {
    return executePreparedStatement(new sql.PreparedStatement(), query, {});
};
const executePreparedStatement = (ps, str, vals) => {
    return new Promise((resolve, reject) => {
        ps.prepare(str, err => {
            if (err)
                reject(err);
            ps.execute(vals, (err, result) => {
                if (err)
                    reject(err);
                ps.unprepare(err => {
                    if (err)
                        reject(err);
                    resolve(result);
                });
            });
        });
    });
};
const formatValues = (values) => {
    let formattedValues = [];
    values.forEach((value, index) => { formattedValues[`value${index + 1}`] = value; });
    return formattedValues;
};
const parseDataType = exports.parseDataType = (type, stringify) => {
    if (stringify) {
        switch (type) {
            case 'varchar(max)[]':
                return 'varchar(max)';
            default: return type;
        }
    }
    switch (type) {
        case 'varchar(max)':
        case 'varchar(max)[]':
            return sql.VarChar(sql.MAX);
        case 'nvarchar(max)': return sql.NVarChar(sql.MAX);
        case 'varbinary(max)': return sql.VarBinary(sql.MAX);
        case 'bit': return sql.Bit;
        case 'int': return sql.Int;
    }
};
const create = exports.create = (tableName, fields, types, values, id) => {
    let createTable = formatCreateTableIfNotExists(tableName, fields, types);
    let insertValues = (id) ? formatInsertValuesIfNotDuplicate(tableName, values, id) : formatInsertValuesPrepareString(tableName, values);
    let prepString = `${createTable} ${insertValues}`;
    const ps = preparedStatementWithInputs(types);
    let formattedValues = formatValues(values);
    return executePreparedStatement(ps, prepString, formattedValues);
};
const read = exports.read = (tableName, query) => {
    let innerQuery = `select * from ${tableName}${query ? ` where ${query}` : ``};`;
    let result = formatIfTableExists(tableName, innerQuery, true);
    return executeQuery(result);
};
const update = exports.update = (tableName, fields, types, values, idVals) => {
    let prepString = formatUpdateValuesPrepareString(tableName, fields);
    let prepTypes = types.slice(1);
    let prepVals = values.slice(1);
    let ps = preparedStatementWithInputs(prepTypes);
    ps.input('id', parseDataType(idVals[1], false));
    let formattedValues = formatValues(prepVals);
    formattedValues.id = idVals[2];
    return executePreparedStatement(ps, prepString, formattedValues);
};
const deleteItem = exports.deleteItem = (tableName, id) => {
    return executeQuery(`delete from ${tableName} where id = '${id}'`);
};
const dropTable = exports.dropTable = (tableName) => {
    let query = formatDropTableIfExists(tableName);
    return executeQuery(query);
};
const create2 = exports.create2 = (info) => {
    let createTable = formatCreateTableIfNotExists(info.tableName, info.columns.map(column => column.name), info.columns.map(column => parseDataType(column.dataType, true)));
    let insertValues = formatInsertValuesIfNotDuplicate2(info);
    let prepString = `${createTable} ${insertValues}`;
    let ps = preparedStatementWithInputs2(undefined, 'value', info.columns.map(column => parseDataType(column.dataType, true)));
    let formattedValues = formatPreparedValues(undefined, 'value', info.columns.map(column => column.value));
    return executePreparedStatement(ps, prepString, formattedValues);
};
const formatUpdateValuesPrepareString2 = (info) => {
    let id = getId(info);
    let paramCount = info.columns.length;
    let query = `update "${info.tableName}" set `;
    for (let i = 0; i < paramCount; i++) {
        if (!info.columns[i].primary) {
            query += `${info.columns[i].name} = @${info.columns[i].name}`;
            if (i < paramCount - 1)
                query += `, `;
        }
    }
    ;
    //query += ` output inserted.* into @output`;
    query += ` where ${id.field} = @${id.field};`;
    return query;
};
const formatIfElseDuplicate = (info, dupeQuery, noDupeQuery) => {
    let id = getId(info);
    let query = `if exists (select * from ${info.tableName} where ${id.field} = @${id.field})
    begin
      ${dupeQuery}
    end;
    else begin
      ${noDupeQuery}
    end`;
    return query;
};
const formatUpdateElseInsert = (info) => {
    let declare = `declare @output table (id varchar(max), serialNumber varchar(max), categoryId varchar(max), manufacturerId varchar(max), notes varchar(max), assignmentId varchar(max), tagIds varchar(max), active bit);`;
    let createTable = formatCreateTableIfNotExists2(info);
    let update = formatUpdateValuesPrepareString2(info);
    let insert = formatInsertValuesPrepareString3(info);
    let result = `${declare}\n${createTable}\n${update}\nif @@rowcount=0\nbegin ${insert}\nend`;
    let ps = preparedStatementWithInputs3(info);
    let values = formatPreparedValues2(info);
    return executePreparedStatement(ps, result, values);
};
const formatCreateTableIfNotExists2 = (info) => {
    let ifNotExists = `if not exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '${info.tableName}')\nbegin `;
    let createTable = `create table "${info.tableName}" (`;
    let columnCount = info.columns.length;
    for (let i = 0; i < columnCount; i++) {
        createTable += `${info.columns[i].name} ${parseDataType(info.columns[i].dataType, true)}`;
        if (i < columnCount - 1)
            createTable += `, `;
    }
    createTable += `);`;
    ifNotExists += createTable;
    ifNotExists += `\nend`;
    return ifNotExists;
};
const save2 = exports.save2 = (info) => {
    /*let save = formatIfElseDuplicate(
      info,
      formatUpdateValuesPrepareString2(info),
      formatInsertValuesPrepareString3(info)
    );
    let tableCreate = formatCreateTableIfNotExists(
      info.tableName,
      info.columns.map(column => column.name),
      info.columns.map(column => column.dataType)
    );
    let result = `${tableCreate} ${save}`;
    let ps = preparedStatementWithInputs3(info);
    let values = formatPreparedValues2(info);*/
    return formatUpdateElseInsert(info);
    //return executePreparedStatement(ps, result, values);
};
const getId = (info) => {
    let idField, idValue;
    for (let i = 0; i < info.columns.length; i++) {
        if (info.columns[i].primary) {
            idField = info.columns[i].name;
            idValue = info.columns[i].value;
            break;
        }
    }
    let result = { field: idField, value: idValue };
    return result;
};
const formatIfNotDuplicate2 = (info, innerQuery) => {
    let id = getId(info);
    let query = `if not exists (select * from ${info.tableName} where ${id.field} = '${id.value}')
    begin
      ${innerQuery}
    end;`;
    return query;
};
const formatInsertValuesPrepareString3 = (info) => {
    let paramCount = info.columns.length;
    let query = `insert into "${info.tableName}" (`;
    for (let i = 0; i < paramCount; i++) {
        query += `${info.columns[i].name}`;
        if (i < paramCount - 1)
            query += `, `;
    }
    ;
    query += `) `;
    //query += ` output inserted.* into @output`;
    query += ` values (`;
    for (let i = 0; i < paramCount; i++) {
        query += `@${info.columns[i].name}`;
        if (i < paramCount - 1)
            query += `, `;
    }
    ;
    query += `);`;
    return query;
};
const formatInsertValuesPrepareString2 = (tableName, columnNames, paramCount) => {
    let query = `insert into "${tableName}" (`;
    for (let i = 0; i < paramCount; i++) {
        query += `${columnNames[i]}`;
        if (i < paramCount - 1)
            query += `, `;
    }
    ;
    query += `) values (`;
    for (let i = 0; i < paramCount; i++) {
        query += `@value${i + 1}`;
        if (i < paramCount - 1)
            query += `, `;
    }
    ;
    query += `);`;
    return query;
};
const preparedStatementWithInputs3 = (info) => {
    let ps = new sql.PreparedStatement();
    info.columns.forEach(column => ps.input(column.name, parseDataType(column.dataType, false)));
    return ps;
};
const formatPreparedValues2 = (info) => {
    let result = {};
    info.columns.forEach(column => result[column.name] = column.value);
    return result;
};
const formatInsertValues2 = (info) => {
    return formatInsertValuesPrepareString2(info.tableName, info.columns.map(column => column.name), Object.keys(info.columns).length);
};
const formatInsertValuesIfNotDuplicate2 = (info) => {
    let query = formatInsertValues2(info);
    query = formatIfNotDuplicate2(info, query);
    return query;
};
const preparedStatementWithInputs2 = (ps, prefix, types) => {
    if (!ps)
        ps = new sql.PreparedStatement();
    for (let i = 0; i < types.length; i++) {
        ps.input(`${prefix}${i + 1}`, parseDataType(types[i], false));
    }
    return ps;
};
const formatPreparedValues = (array, prefix, values) => {
    if (!array)
        array = {};
    values.forEach((value, index) => { array[`${prefix}${index + 1}`] = value; });
    return array;
};
const findByColumn = exports.findByColumn = (tableName, column) => {
    let innerQuery = `select * from ${tableName} where ${column.name} = @value1`;
    let fullQuery = formatIfTableExists(tableName, innerQuery, true);
    let statement = preparedStatementWithInputs2(undefined, 'value', [parseDataType(column.dataType, true)]);
    let formattedValues = formatPreparedValues(undefined, 'value', [column.value]);
    return executePreparedStatement(statement, fullQuery, formattedValues);
};
const pullAll = exports.pullAll = (tableName) => {
    let innerQuery = `select * from ${tableName}`;
    let fullQuery = formatIfTableExists(tableName, innerQuery, true);
    return executeQuery(fullQuery);
};
const deleteByColumn = exports.deleteByColumn = (tableName, column) => {
    let innerQuery = `delete from ${tableName} where ${column.name} = @value1`;
    let fullQuery = formatIfTableExists(tableName, innerQuery, true);
    let statement = preparedStatementWithInputs2(undefined, 'value', [parseDataType(column.dataType, true)]);
    let formattedValues = formatPreparedValues(undefined, 'value', [column.value]);
    return executePreparedStatement(statement, fullQuery, formattedValues);
};
//# sourceMappingURL=db.js.map
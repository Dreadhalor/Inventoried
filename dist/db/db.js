var _this = this;
var sql = require('mssql/msnodesqlv8');
var fse = require('fs-extra');
var replace = require('replace-in-file');
var promisify = require('util').promisify;
var datatypeParser = require('./db-helpers/datatype-parser');
var databaseName = exports.databaseName;
var connected = false;
var callbacks = [];
var config;
module.exports.connect = function (config) {
    _this.config = config;
    setDatabaseName(config.database);
    var destDirectory = "src/db/scripts/generated/database";
    var destFile = "create_database_" + databaseName + ".sql";
    var destPath = destDirectory + "/" + destFile;
    var srcPath = 'src/db/scripts/templates/create_database.template.sql';
    var substitutionOptions = {
        files: destPath,
        from: /<database_name>/g,
        to: databaseName
    };
    config.database = 'master';
    return sql.connect(config)
        .then(function (connected) { return fse.ensureDir(destDirectory); })
        .then(function (directory) { return fse.emptyDir(destDirectory); })
        .then(function (emptied) { return fse.copy(srcPath, destPath); })
        .then(function (copied) { return replace(substitutionOptions); })
        .then(function (replaced) { return fse.readFile(destPath, 'utf8'); })
        .then(function (query) { return executeQueryAsPreparedStatementOnMaster(query); })
        .then(function (dbExists) {
        config.database = databaseName;
        return sql.close();
    })
        .then(function (closed) { return sql.connect(config); })
        .then(function (connected) { return hasConnected(); });
};
var setDatabaseName = function (name) {
    databaseName = name;
    exports.databaseName = databaseName;
};
var onConnected = exports.onConnected = function (fxn) {
    if (fxn) {
        if (connected)
            fxn(connected);
        else
            callbacks.unshift(fxn);
    }
};
var hasConnected = function () {
    connected = true;
    var len = callbacks.length - 1;
    for (var i = len; i >= 0; i--) {
        callbacks[i](connected);
        callbacks.splice(i, 1);
    }
};
var doesTableExist = exports.doesTableExist = function (tableName) {
    var query = "select case when exists " +
        ("(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '" + tableName + "') ") +
        "then cast(1 as bit) else cast(0 as bit) end";
    return executeQuery(query).then(function (resolve) { return resolve.recordset[0]['']; }, function (reject) { return false; });
};
function pairArgs(args1, args2) {
    var pairs = args1.map(function (arg, index) { return arg + " " + args2[index]; });
    return pairs;
}
function formatArgs(args, delimiter) {
    var argsString = '(';
    args.forEach(function (arg, index) {
        argsString += "" + delimiter + arg + delimiter;
        if (index < args.length - 1)
            argsString += ', ';
        else
            argsString += ')';
    });
    return argsString;
}
var executeQuery = exports.executeQuery = function (query) {
    /*return new Promise((resolve,reject) => {
      try {
        const transaction = new sql.Transaction();
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
      } catch (err4){ reject(err4); }
    });*/
    return new sql.Request().query(query);
};
var bulkAddition = exports.bulkAddition = function (tableName, columnNames, dataTypes, rows) {
    return new Promise(function (resolve, reject) {
        var table = new sql.Table(tableName);
        table.create = true;
        columnNames.forEach(function (column, index) {
            table.columns.add(column, parseDataType(dataTypes[index], false), { nullable: false });
        });
        rows.forEach(function (row) {
            var _a;
            var x = row[0], remaining = row.slice(1);
            (_a = table.rows).add.apply(_a, [x].concat(remaining));
        });
        var request = new sql.Request();
        request.bulk(table, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
var bulkAddition2 = exports.bulkAddition2 = function (info, values) {
    var table = new sql.Table(info.tableName);
    table.create = true;
    info.columns.forEach(function (column) {
        table.columns.add(column.name, parseDataType(column.dataType, false), { nullable: false });
    });
    values.forEach(function (value) {
        var _a;
        value = info.columns.map(function (column) { return value[column.name]; });
        var x = value[0], remaining = value.slice(1);
        (_a = table.rows).add.apply(_a, [x].concat(remaining));
    });
    return new sql.ConnectionPool(_this.config)
        .then(function (pool) { return new sql.Request(pool).bulk(table); });
    var cb = function (err, result) {
        if (err)
            throw err;
        return result;
    };
    //return request.bulk(table);
};
var formatIfTableExists = function (tableName, innerQuery, exists) {
    var query = "if " + (exists ? "" : "not ") + "exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '" + tableName + "')\n    begin\n      " + innerQuery + "\n    end;";
    return query;
};
var formatCreateTable = function (tableName, fields, types) {
    var query = "create table \"" + tableName + "\" " + formatArgs(pairArgs(fields, types), '');
    return query;
};
var formatCreateTableIfNotExists = function (tableName, fields, types) {
    var query = formatCreateTable(tableName, fields, types);
    query = formatIfTableExists(tableName, query, false);
    return query;
};
var formatDropTableIfExists = function (tableName) {
    var innerQuery = "drop table " + tableName + ";";
    var query = formatIfTableExists(tableName, innerQuery, true);
    return query;
};
var formatIfNotDuplicate = function (tableName, innerQuery, id) {
    var query = "if not exists (select * from " + tableName + " where id = '" + id + "')\n    begin\n      " + innerQuery + ";\n    end;";
    return query;
};
var formatInsertValues = function (tableName, values) {
    return formatInsertValuesPrepareString(tableName, values);
};
var formatInsertValuesIfNotDuplicate = function (tableName, values, id) {
    var query = formatInsertValues(tableName, values);
    query = formatIfNotDuplicate(tableName, query, id);
    return query;
};
var formatInsertValuesPrepareString = function (tableName, values) {
    var paramCount = values.length;
    var query = "insert into \"" + tableName + "\" values (";
    for (var i = 1; i <= paramCount; i++) {
        query += "@value" + i;
        if (i < paramCount)
            query += ", ";
    }
    ;
    query += ");";
    return query;
};
var formatUpdateValuesPrepareString = function (tableName, fields) {
    var paramCount = fields.length;
    var query = "update \"" + tableName + "\" set ";
    for (var i = 1; i < paramCount; i++) {
        query += fields[i] + " = @value" + i;
        if (i < paramCount - 1)
            query += ", ";
    }
    ;
    query += " where id = @id;";
    return query;
};
var preparedStatementWithInputs = function (types) {
    var ps = new sql.PreparedStatement();
    for (var i = 0; i < types.length; i++) {
        ps.input("value" + (i + 1), parseDataType(types[i], false));
    }
    return ps;
};
var executeQueryAsPreparedStatement = exports.executeQueryAsPreparedStatement = function (query) {
    return executePreparedStatement(new sql.PreparedStatement(), query, {});
};
var executeQueryAsPreparedStatementOnMaster = function (query) {
    return executePreparedStatement(new sql.PreparedStatement(), query, {});
};
var executePreparedStatement = function (ps, str, vals) {
    var result;
    return ps.prepare(str)
        .then(function (prepared) { return ps.execute(vals); })
        .then(function (executed) {
        result = executed;
        return ps.unprepare();
    })
        .then(function (unprepared) { return result; });
};
var formatValues = function (values) {
    var formattedValues = [];
    values.forEach(function (value, index) { formattedValues["value" + (index + 1)] = value; });
    return formattedValues;
};
var parseDataType = exports.parseDataType = datatypeParser.parseDataType;
var create = exports.create = function (tableName, fields, types, values, id) {
    var createTable = formatCreateTableIfNotExists(tableName, fields, types);
    var insertValues = (id) ? formatInsertValuesIfNotDuplicate(tableName, values, id) : formatInsertValuesPrepareString(tableName, values);
    var prepString = createTable + " " + insertValues;
    var ps = preparedStatementWithInputs(types);
    var formattedValues = formatValues(values);
    return executePreparedStatement(ps, prepString, formattedValues);
};
var read = exports.read = function (tableName, query) {
    var innerQuery = "select * from " + tableName + (query ? " where " + query : "") + ";";
    var result = formatIfTableExists(tableName, innerQuery, true);
    return executeQuery(result);
};
var update = exports.update = function (tableName, fields, types, values, idVals) {
    var prepString = formatUpdateValuesPrepareString(tableName, fields);
    var prepTypes = types.slice(1);
    var prepVals = values.slice(1);
    var ps = preparedStatementWithInputs(prepTypes);
    ps.input('id', parseDataType(idVals[1], false));
    var formattedValues = formatValues(prepVals);
    formattedValues.id = idVals[2];
    return executePreparedStatement(ps, prepString, formattedValues);
};
var deleteItem = exports.deleteItem = function (tableName, id) {
    return executeQuery("delete from " + tableName + " where id = '" + id + "'");
};
var dropTable = exports.dropTable = function (tableName) {
    var query = formatDropTableIfExists(tableName);
    return executeQuery(query);
};
var create2 = exports.create2 = function (info) {
    var createTable = formatCreateTableIfNotExists(info.tableName, info.columns.map(function (column) { return column.name; }), info.columns.map(function (column) { return parseDataType(column.dataType, true); }));
    var insertValues = formatInsertValuesIfNotDuplicate2(info);
    var prepString = createTable + " " + insertValues;
    var ps = preparedStatementWithInputs2(undefined, 'value', info.columns.map(function (column) { return parseDataType(column.dataType, true); }));
    var formattedValues = formatPreparedValues(undefined, 'value', info.columns.map(function (column) { return column.value; }));
    return executePreparedStatement(ps, prepString, formattedValues);
};
var formatUpdateValuesPrepareString2 = function (info) {
    var id = getId(info);
    var paramCount = info.columns.length;
    var query = "update \"" + info.tableName + "\" set ";
    for (var i = 0; i < paramCount; i++) {
        if (!info.columns[i].primary) {
            query += "\"" + info.columns[i].name + "\" = @" + info.columns[i].name;
            if (i < paramCount - 1)
                query += ", ";
        }
    }
    ;
    query += " where " + id.field + " = @" + id.field + ";";
    return query;
};
var formatIfElseDuplicate = function (info, dupeQuery, noDupeQuery) {
    var id = getId(info);
    var query = "if exists (select * from " + info.tableName + " where " + id.field + " = @" + id.field + ")\n    begin\n      " + dupeQuery + "\n    end;\n    else begin\n      " + noDupeQuery + "\n    end";
    return query;
};
var formatUpdateElseInsert = function (info) {
    var createTable = formatCreateTableIfNotExists2(info);
    var update = formatUpdateValuesPrepareString2(info);
    var insert = formatInsertValuesPrepareString3(info);
    var result = createTable + "\n" + update + "\nif @@rowcount=0\nbegin " + insert + "\nend";
    var ps = preparedStatementWithInputs3(info);
    var values = formatPreparedValues2(info);
    return executePreparedStatement(ps, result, values);
};
var formatCreateTableIfNotExists2 = function (info) {
    var ifNotExists = "if not exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = '" + info.tableName + "')\nbegin ";
    var createTable = "create table \"" + info.tableName + "\" (";
    var columnCount = info.columns.length;
    for (var i = 0; i < columnCount; i++) {
        createTable += info.columns[i].name + " " + parseDataType(info.columns[i].dataType, true);
        if (i < columnCount - 1)
            createTable += ", ";
    }
    createTable += ");";
    ifNotExists += createTable;
    ifNotExists += "\nend";
    return ifNotExists;
};
var save2 = exports.save2 = function (info) {
    return formatUpdateElseInsert(info);
};
var getId = function (info) {
    var idField, idValue;
    for (var i = 0; i < info.columns.length; i++) {
        if (info.columns[i].primary) {
            idField = info.columns[i].name;
            idValue = info.columns[i].value;
            break;
        }
    }
    var result = { field: idField, value: idValue };
    return result;
};
var formatIfNotDuplicate2 = function (info, innerQuery) {
    var id = getId(info);
    var query = "if not exists (select * from " + info.tableName + " where " + id.field + " = '" + id.value + "')\n    begin\n      " + innerQuery + "\n    end;";
    return query;
};
var formatInsertValuesPrepareString3 = function (info) {
    var paramCount = info.columns.length;
    var query = "insert into \"" + info.tableName + "\" (";
    for (var i = 0; i < paramCount; i++) {
        query += "" + info.columns[i].name;
        if (i < paramCount - 1)
            query += ", ";
    }
    ;
    query += ") ";
    //query += ` output inserted.* into @output`;
    query += " values (";
    for (var i = 0; i < paramCount; i++) {
        query += "@" + info.columns[i].name;
        if (i < paramCount - 1)
            query += ", ";
    }
    ;
    query += ");";
    return query;
};
var formatInsertValuesPrepareString2 = function (tableName, columnNames, paramCount) {
    var query = "insert into \"" + tableName + "\" (";
    for (var i = 0; i < paramCount; i++) {
        query += "" + columnNames[i];
        if (i < paramCount - 1)
            query += ", ";
    }
    ;
    query += ") values (";
    for (var i = 0; i < paramCount; i++) {
        query += "@value" + (i + 1);
        if (i < paramCount - 1)
            query += ", ";
    }
    ;
    query += ");";
    return query;
};
var prepareQueryAndExecute = exports.prepareQueryAndExecute = function (query, info) {
    var ps = preparedStatementWithInputs3(info);
    var values = formatPreparedValues2(info);
    return executePreparedStatement(ps, query, values);
};
var preparedStatementWithInputs3 = function (info) {
    var ps = new sql.PreparedStatement();
    info.columns.forEach(function (column) { return ps.input(column.name, parseDataType(column.dataType, false)); });
    return ps;
};
var formatPreparedValues2 = function (info) {
    var result = {};
    info.columns.forEach(function (column) { return result[column.name] = column.value; });
    return result;
};
var formatInsertValues2 = function (info) {
    return formatInsertValuesPrepareString2(info.tableName, info.columns.map(function (column) { return column.name; }), Object.keys(info.columns).length);
};
var formatInsertValuesIfNotDuplicate2 = function (info) {
    var query = formatInsertValues2(info);
    query = formatIfNotDuplicate2(info, query);
    return query;
};
var preparedStatementWithInputs2 = function (ps, prefix, types) {
    if (!ps)
        ps = new sql.PreparedStatement();
    for (var i = 0; i < types.length; i++) {
        ps.input("" + prefix + (i + 1), parseDataType(types[i], false));
    }
    return ps;
};
var formatPreparedValues = function (array, prefix, values) {
    if (!array)
        array = {};
    values.forEach(function (value, index) { array["" + prefix + (index + 1)] = value; });
    return array;
};
var findByColumn = exports.findByColumn = function (tableName, column) {
    var innerQuery = "select * from " + tableName + " where " + column.name + " = @value1";
    var fullQuery = formatIfTableExists(tableName, innerQuery, true);
    var statement = preparedStatementWithInputs2(undefined, 'value', [parseDataType(column.dataType, true)]);
    var formattedValues = formatPreparedValues(undefined, 'value', [column.value]);
    return executePreparedStatement(statement, fullQuery, formattedValues);
};
var pullAll = exports.pullAll = function (tableName) {
    var innerQuery = "select * from " + tableName;
    var fullQuery = formatIfTableExists(tableName, innerQuery, true);
    return executeQuery(fullQuery);
};
var deleteByColumn = exports.deleteByColumn = function (tableName, column) {
    var innerQuery = "delete from " + tableName + " where " + column.name + " = @value1";
    var fullQuery = formatIfTableExists(tableName, innerQuery, true);
    var statement = preparedStatementWithInputs2(undefined, 'value', [parseDataType(column.dataType, true)]);
    var formattedValues = formatPreparedValues(undefined, 'value', [column.value]);
    return executePreparedStatement(statement, fullQuery, formattedValues);
};
//# sourceMappingURL=db.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var fse = require("fs-extra");
var Promise = require("bluebird");
var scriptGenerator = require('./table-helpers/table-script-generator');
var Table = /** @class */ (function () {
    function Table(db, schema) {
        var _this = this;
        this.columns = [];
        this.update = new rxjs_1.Subject();
        this.templateDirectory = 'src/db/scripts/templates';
        this.templateFiles = {
            createTable: {
                file: 'create_table.template.sql',
                runOrder: 0
            },
            createUpdateTrigger: {
                file: 'update_trigger.template.sql',
                runOrder: 1
            },
            createSaveQuery: {
                file: 'save.template.sql',
                runOrder: -1
            }
        };
        this.db = db;
        this.tableName = schema.tableName;
        schema.columns.forEach(function (column) {
            _this.columns.push({
                name: column.name,
                dataType: column.dataType,
                primary: !!column.primary
            });
        });
        this.columns = this.singularizePrimaryKey(this.columns);
        var scripts;
        scriptGenerator.generateScripts({
            database: db,
            tableName: this.tableName,
            columns: this.columns,
            templateDirectory: 'src/db/scripts/templates',
            templateFiles: this.templateFilesMapped,
            tablesDirectory: 'src/db/scripts/generated/tables',
        })
            .then(function (scriptFiles) {
            scripts = _this.templateFilesInRunOrder.map(function (group) { return group.map(function (name) { return scriptFiles[name]; }); });
            return new Promise(function (resolve) {
                db.onConnected(function (result) { return resolve(result); });
            });
        })
            .then(function (databaseExists) { return _this.nestedPromiseAll(scripts, function (file) { return fse.readFile(file, 'utf8'); }); })
            .then(function (result) { return _this.sequentialPromiseAll(result, db.executeQueryAsPreparedStatement); })
            .catch(function (exception) { return console.log(exception); });
    }
    Object.defineProperty(Table.prototype, "templateFilesMapped", {
        get: function () {
            var _this = this;
            var result = {};
            var keys = Object.keys(this.templateFiles);
            keys.forEach(function (key) { return result[key] = _this.templateFiles[key].file; });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "templateFilesInRunOrder", {
        get: function () {
            var queue = [];
            var files = Object.entries(this.templateFiles);
            files = files.map(function (file) {
                return {
                    name: file[0],
                    runOrder: file[1].runOrder
                };
            });
            files.sort(function (a, b) { return a.runOrder - b.runOrder; });
            files = files.filter(function (a) { return a.runOrder >= 0; });
            while (files.length > 0) {
                var group = [], indexes = [], turn = files[0].runOrder;
                for (var i = 0; i < files.length; i++)
                    if (files[i].runOrder == turn)
                        indexes.push(i);
                for (var i = indexes.length - 1; i >= 0; i--)
                    group = group.concat(files.splice(i, 1).map(function (file) { return file.name; }));
                queue.push(group);
            }
            return queue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "destDirectory", {
        get: function () {
            return "src/db/scripts/generated/tables/" + this.tableName;
        },
        enumerable: true,
        configurable: true
    });
    Table.prototype.nestedPromiseAll = function (groups, fxn) {
        return Promise.all(groups.map(function (group) { return Promise.all(group.map(function (single) { return fxn(single); })); }));
    };
    Table.prototype.sequentialPromiseAll = function (groups, fxn) {
        return Promise.each(groups, function (group) { return Promise.all(group.map(function (single) { return fxn(single); })); });
    };
    Table.prototype.singularizePrimaryKey = function (columns) {
        var primary = false;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].primary) {
                if (primary)
                    columns[i].primary = false;
                primary = true;
            }
        }
        return columns;
    };
    Table.prototype.primaryKey = function () {
        var pk = this.columns.find(function (match) { return match.primary; });
        return pk;
    };
    Table.prototype.fields = function () {
        return this.columns.map(function (column) { return column.name; });
    };
    Table.prototype.oneHotPrimaryKeyArray = function () {
        return this.columns.map(function (column) { return column.primary; });
    };
    Table.prototype.formatObject = function (obj) {
        var _this = this;
        var result = {};
        this.columns.forEach(function (column) {
            var val = obj[column.name];
            if (_this.shouldStringify(column)) {
                val = JSON.stringify(val);
            }
            result[column.name] = val;
        });
        return result;
    };
    Table.prototype.formatRow = function (obj) {
        var columns = this.columns.map(function (column) {
            //DEEP COPYING NECESSARY FOR CLOSELY-SPACED EDITS
            column = Table.deepCopy(column);
            column.value = obj[column.name];
            return column;
        });
        return columns;
    };
    Table.prototype.tableInfo = function () {
        return {
            tableName: this.tableName,
            columns: this.columns.map(function (column) { return Table.deepCopy(column); })
        };
    };
    Table.prototype.equals = function (array1, array2) {
        var a1 = array1.length, a2 = array2.length;
        if (a1 != a2)
            return false;
        for (var i = 0; i < a1; i++) {
            if (array1[i] != array2[i])
                return false;
        }
        return true;
    };
    Table.prototype.saveSingular = function (item) {
        var _this = this;
        if (!item)
            throw 'Item is null';
        var itemKeys = Object.keys(item);
        if (this.equals(itemKeys, this.fields())) {
            var formattedItem = this.formatObject(item);
            var info_1 = {
                tableName: this.tableName,
                columns: this.formatRow(formattedItem)
            };
            return fse.readFile("src/db/scripts/generated/tables/" + this.tableName + "/save_" + this.tableName + ".sql", 'utf8')
                .then(function (file) { return _this.db.prepareQueryAndExecute(file, info_1); })
                .then(function (executed) { return _this.processRecordsets(executed); })
                .then(function (processed) {
                var result;
                if (processed.length > 1)
                    result = {
                        operation: 'update',
                        deleted: processed[0],
                        created: processed[1]
                    };
                else
                    result = {
                        operation: 'create',
                        created: processed[0]
                    };
                return result;
            });
        }
        throw 'Item properties are incorrect.';
    };
    Table.prototype.saveMultiple = function (items) {
        var _this = this;
        if (!items)
            throw 'Item is null';
        if (!Array.isArray(items)) {
            var array = [];
            array.push(items);
            items = array;
        }
        var promises = items.map(function (item) { return _this.saveSingular(item); });
        return Promise.all(promises)
            .then(function (success) {
            //success = array of ops
            var created = success.filter(function (match) { return match.operation == 'create'; })
                .map(function (op) { return op.created; });
            var updated = success.filter(function (match) { return match.operation == 'update'; })
                .map(function (op) {
                return {
                    created: op.created,
                    deleted: op.deleted
                };
            });
            var result;
            if (created.length > 0 && updated.length > 0) {
                result = {
                    operation: 'create update',
                    created: created,
                    updated: updated
                };
            }
            else if (created.length > 0) {
                result = {
                    operation: 'create',
                    created: created
                };
            }
            else if (updated.length > 0) {
                result = {
                    operation: 'update',
                    updated: updated
                };
            }
            return result;
        });
    };
    Table.prototype.save = function (items, agent) {
        var _this = this;
        return this.saveMultiple(items)
            .then(function (result) {
            if (result) {
                result.table = _this.tableName;
                if (agent)
                    result.agent = agent;
                _this.update.next(result);
            }
            return result;
        });
    };
    Table.prototype.findById = function (id) {
        var _this = this;
        var pk = this.primaryKey();
        pk.value = id;
        return this.db.findByColumn(this.tableName, pk)
            .then(function (found) { return _this.processRecordsets(found)[0]; });
    };
    Table.prototype.pullAll = function () {
        var _this = this;
        return this.db.pullAll(this.tableName)
            .then(function (pulled) { return _this.processRecordsets(pulled); });
    };
    Table.prototype.deleteById = function (id, agent) {
        var _this = this;
        var pk = this.primaryKey();
        pk.value = id;
        return this.db.deleteByColumn(this.tableName, pk)
            .then(function (deleted) { return _this.processRecordsets(deleted); })
            .then(function (processed) {
            var array = [];
            array.push(processed[0]);
            var result = {
                table: _this.tableName,
                operation: 'delete',
                deleted: array
            };
            if (agent)
                result.agent = agent;
            _this.update.next(result);
            return result;
        });
    };
    Table.prototype.deleteSingularById = function (id, agent) {
        var _this = this;
        var pk = this.primaryKey();
        pk.value = id;
        return this.db.deleteByColumn(this.tableName, pk)
            .then(function (deleted) { return _this.processRecordsets(deleted); })
            .then(function (processed) {
            var result = {
                operation: 'delete',
                deleted: processed[0]
            };
            return result;
        });
    };
    Table.prototype.deleteMultipleByIds = function (ids) {
        var _this = this;
        if (ids) {
            if (!Array.isArray(ids)) {
                var array = [];
                array.push(ids);
                ids = array;
            }
            var promises = ids.map(function (id) { return _this.deleteSingularById(id); });
            return Promise.all(promises)
                .then(function (success) {
                //success = array of delete ops
                var deleted = success.filter(function (match) { return match.operation == 'delete'; })
                    .map(function (op) { return op.deleted; });
                var result;
                if (deleted.length > 0) {
                    result = {
                        operation: 'delete',
                        deleted: deleted
                    };
                }
                return result;
            });
        }
        else
            throw 'No items specified to delete.';
    };
    Table.prototype.merge = function (items, agent) {
        var _this = this;
        if (items) {
            var toSave = items.toSave;
            var toDelete = items.toDelete;
            if ((toSave && Array.isArray(toSave)) || (toDelete && Array.isArray(toDelete))) {
                var saved_1, deleted_1, result_1;
                saved_1 = this.saveMultiple(toSave);
                deleted_1 = this.deleteMultipleByIds(toDelete);
                return Promise.all([saved_1, deleted_1])
                    .then(function (success) {
                    saved_1 = success[0];
                    deleted_1 = success[1];
                    if (saved_1 && deleted_1) {
                        result_1 = {
                            operation: (saved_1.operation + " " + deleted_1.operation).trim(),
                            created: saved_1.created,
                            updated: saved_1.updated,
                            deleted: deleted_1.deleted
                        };
                    }
                    else if (saved_1)
                        result_1 = saved_1;
                    else if (deleted_1)
                        result_1 = deleted_1;
                    if (result_1) {
                        result_1.table = _this.tableName;
                        if (agent)
                            result_1.agent = agent;
                        _this.update.next(result_1);
                    }
                    return result_1;
                });
            }
            else
                throw 'Incorrect format.';
        }
        else
            throw 'No items to modify.';
    };
    Table.prototype.processRecordsets = function (result) {
        if (result &&
            result.recordset &&
            result.recordset.length > 0)
            return this.parseObjects(result.recordset);
        return [];
    };
    Table.prototype.shouldStringify = function (column) {
        return column.dataType.includes('[]') || column.dataType == 'object';
    };
    Table.prototype.parseObjects = function (objs) {
        var _this = this;
        var result = [];
        objs.forEach(function (obj) {
            var parsedObj = {};
            var keys = Object.keys(obj);
            keys.forEach(function (key) {
                var found = _this.columns.find(function (match) { return match.name == key; });
                if (found) {
                    if (_this.shouldStringify(found))
                        parsedObj[key] = JSON.parse(obj[key]);
                    else
                        parsedObj[key] = obj[key];
                }
            });
            result.push(parsedObj);
        });
        return result;
    };
    Table.deepCopy = function (obj) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj;
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
                if (obj.hasOwnProperty(attr))
                    copy[attr] = this.deepCopy(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.js.map
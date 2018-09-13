"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableCreateOps = /** @class */ (function () {
    function TableCreateOps(table) {
        this.table = table;
    }
    TableCreateOps.prototype.equals = function (array1, array2) {
        var a1 = array1.length, a2 = array2.length;
        if (a1 != a2)
            return false;
        for (var i = 0; i < a1; i++) {
            if (array1[i] != array2[i])
                return false;
        }
        return true;
    };
    TableCreateOps.prototype.fields = function () {
        return this.table.columns.map(function (column) { return column.name; });
    };
    TableCreateOps.prototype.saveSingular = function (item) {
        var _this = this;
        if (!item)
            throw 'Item is null';
        var itemKeys = Object.keys(item);
        if (this.equals(itemKeys, this.fields())) {
            var formattedItem = this.table.processor.formatObject(item);
            var info_1 = {
                tableName: this.table.tableName,
                columns: this.table.formatRow(formattedItem)
            };
            return fse.readFile("src/db/scripts/generated/tables/" + this.table.tableName + "/save_" + this.table.tableName + ".sql", 'utf8')
                .then(function (file) { return _this.table.db.prepareQueryAndExecute(file, info_1); })
                .then(function (executed) { return _this.table.processor.processRecordsets(executed); })
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
    TableCreateOps.prototype.saveMultiple = function (items) {
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
    return TableCreateOps;
}());
exports.TableCreateOps = TableCreateOps;
//# sourceMappingURL=create-ops.js.map
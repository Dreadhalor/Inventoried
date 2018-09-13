"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TableDeleteOps = /** @class */ (function () {
    function TableDeleteOps(table) {
        this.table = table;
    }
    TableDeleteOps.prototype.deleteById = function (id, agent) {
        var _this = this;
        var pk = this.table.primaryKey();
        pk.value = id;
        return this.table.db.deleteByColumn(this.table.tableName, pk)
            .then(function (deleted) { return _this.table.processor.processRecordsets(deleted); })
            .then(function (processed) {
            var array = [];
            array.push(processed[0]);
            var result = {
                table: _this.table.tableName,
                operation: 'delete',
                deleted: array
            };
            if (agent)
                result.agent = agent;
            _this.table.update.next(result);
            return result;
        });
    };
    TableDeleteOps.prototype.deleteSingularById = function (id, agent) {
        var _this = this;
        var pk = this.table.primaryKey();
        pk.value = id;
        return this.table.db.deleteByColumn(this.table.tableName, pk)
            .then(function (deleted) { return _this.table.processor.processRecordsets(deleted); })
            .then(function (processed) {
            var result = {
                operation: 'delete',
                deleted: processed[0]
            };
            return result;
        });
    };
    TableDeleteOps.prototype.deleteMultipleByIds = function (ids) {
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
    return TableDeleteOps;
}());
exports.TableDeleteOps = TableDeleteOps;
//# sourceMappingURL=delete-ops.js.map
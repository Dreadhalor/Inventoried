"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var Assignment = /** @class */ (function () {
    function Assignment(iassignment) {
        this.id = uuid();
        if (iassignment.id)
            this.id = iassignment.id;
        this.userId = iassignment.userId;
        this.assetId = iassignment.assetId;
        this.checkoutDate = iassignment.checkoutDate;
        this.dueDate = iassignment.dueDate;
    }
    Assignment.sqlFieldsWithItem = function (item) {
        return {
            tableName: 'assignment',
            columns: [
                { name: 'id', dataType: 'varchar(max)', primary: true },
                { name: 'userId', dataType: 'varchar(max)' },
                { name: 'assetId', dataType: 'varchar(max)' },
                { name: 'checkoutDate', dataType: 'varchar(max)' },
                { name: 'dueDate', dataType: 'varchar(max)' }
            ],
            item: item
        };
    };
    return Assignment;
}());
exports.Assignment = Assignment;
//# sourceMappingURL=assignment.js.map
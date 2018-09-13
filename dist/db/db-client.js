"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_1 = require("./table");
const rxjs_1 = require("rxjs");
const db = require('./db');
exports.connect = (config) => db.connect(config);
let subscriptions = [];
const history = new rxjs_1.Subject();
exports.history = history.asObservable();
exports.Table = (schema) => {
    let table = new table_1.Table(db, schema);
    subscriptions.push(table.update.asObservable().subscribe(next => history.next(next)));
    return table;
};
//# sourceMappingURL=db-client.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BluebirdPlus;
(function (BluebirdPlus) {
    var Promise = require('bluebird');
    var queue = [];
    var running = false;
    var queuePromise = function (args, fxn) {
        var pair = {
            args: args,
            fxn: fxn
        };
        queue.push(pair);
        if (!running)
            advanceQueue();
    };
    var advanceQueue = function () {
        running = true;
        if (queue.length > 0) {
            var pair = queue.pop();
            pair.fxn(pair.args)
                .then(function (success) { return advanceQueue(); })
                .catch(function (error) { return advanceQueue(); });
        }
        else
            running = false;
    };
    var nestedPromiseAll = function (groups, fxn) {
        return Promise.all(groups.map(function (group) { return Promise.all(group.map(function (single) { return fxn(single); })); }));
    };
    var sequentialPromiseAll = function (groups, fxn) {
        return Promise.each(groups, function (group) { return Promise.all(group.map(function (single) { return fxn(single); })); });
    };
    exports.queue = queuePromise;
    exports.nestedPromiseAll = nestedPromiseAll;
    exports.sequentialPromiseAll = sequentialPromiseAll;
})(BluebirdPlus = exports.BluebirdPlus || (exports.BluebirdPlus = {}));
//# sourceMappingURL=bluebird-plus.js.map
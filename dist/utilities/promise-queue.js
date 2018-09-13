"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PromiseQueue;
(function (PromiseQueue) {
    var queue = [];
    var running = false;
    var push = function (args, fxn) {
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
    module.exports = push;
})(PromiseQueue = exports.PromiseQueue || (exports.PromiseQueue = {}));
//# sourceMappingURL=promise-queue.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error;
(function (Error) {
    var formatError = exports.formatError = function (error, title) {
        if (typeof error != 'string')
            error = JSON.stringify(error);
        var result = {
            error: {
                title: title,
                message: error
            }
        };
        return result;
    };
})(Error = exports.Error || (exports.Error = {}));
//# sourceMappingURL=error.js.map
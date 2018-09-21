var jwt = require('jsonwebtoken');
var promisify = require('util').promisify;
var PromisePlus = require('@dreadhalor/bluebird-plus');
var config = require('../program-config');
var ActiveDirectory = require('activedirectory2');
var ADPromise = ActiveDirectory.promiseWrapper;
var ad = new ADPromise(config.activedirectory2);
var authenticate = exports.authenticate = function (username, password) {
    return PromisePlus.convertToBreakable(ad.authenticate(username, password))
        .break(function (unauthorized) {
        var error = {
            error: {
                title: 'Login error',
                message: 'Invalid credentials'
            }
        };
        return error;
    });
};
var checkAuthorization = exports.checkAuthorization = function (token) {
    var result;
    if (!token)
        result = Promise.reject();
    else
        result = promisify(jwt.verify)(token, config.secret);
    return PromisePlus.convertToBreakable(result);
};
var checkAdminAuthorization = exports.checkAdminAuthorization = function (token, title) {
    var result = checkAuthorization(token)
        .then(function (payload) { return isAdmin(payload.username); });
    if (title) {
        var error_1 = {
            error: {
                title: title,
                message: 'Unauthorized.'
            }
        };
        return result.break(function (unauthorized) { return error_1; });
    }
    return result;
};
var isAdmin = function (username) {
    return ad.isUserMemberOf(username, 'Applied technology')
        .then(function (result) {
        if (result)
            return username;
        throw 'Unauthorized.';
    });
};
//# sourceMappingURL=auth.js.map
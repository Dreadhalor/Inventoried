var jwt = require('jsonwebtoken');
var promisify = require('util').promisify;
var PromisePlus = require('@dreadhalor/bluebird-plus');
var UserRoles = require('../../config.json').shared.roles;
var config = require('../server-config');
var ActiveDirectory = require('activedirectory2');
var ADPromise = ActiveDirectory.promiseWrapper;
var ad = new ADPromise(config.activedirectory2);
var err = require('./error');
var getGroups = function (username) {
    return ad.getGroupMembershipForUser(username)
        .then(function (result) { return result.map(function (group) { return group.cn; }); });
};
var authenticate = exports.authenticate = function (username, password) {
    return PromisePlus.convertToBreakable(ad.authenticate(username, password))
        .break(function (unauthorized) { return err.formatError('Invalid credentials.', 'Login error'); });
};
var decodeToken = exports.decodeToken = function (token, role) {
    var result;
    if (!token)
        result = Promise.reject();
    else
        result = promisify(jwt.verify)(token, config.secret);
    return PromisePlus.convertToBreakable(result);
};
var authguard = exports.authguard = function (token, role, title) {
    var username;
    var result = decodeToken(token)
        .then(function (payload) {
        username = payload.username;
        return getGroups(payload.username);
    })
        .break(function (invalid) { return 'Invalid login token.'; })
        .then(function (groups) { return groups.includes(UserRoles[role]); })
        .then(function (rolecheck) {
        if (!rolecheck)
            throw 'Unauthorized.';
        return username;
    })
        .break(function (error) { return error; });
    if (title)
        return result.broken(function (errorMsg) { return err.formatError(errorMsg, title); });
    return result;
};
//# sourceMappingURL=auth.js.map
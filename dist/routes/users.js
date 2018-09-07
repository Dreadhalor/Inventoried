"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const config = require('../config');
const guidParser = require('../guid-parse');
const WindowsStrategy = require('passport-windowsauth');
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
let ad = new ADPromise(config.activedirectory2);
let jwt = require('jsonwebtoken');
let promisify = require('util').promisify;
const passport = require("passport");
router.get('/get_all_users', (req, res) => __awaiter(this, void 0, void 0, function* () {
    ad.findUsers({ paged: false }).then(users => {
        if (users.length == 0)
            res.json('No users found.');
        else
            res.json(users.map(user => formatLDAPData(user)));
    }, rejected => res.json(rejected)).catch(exception => res.json(exception));
}));
const getUser = (userId) => {
    let parsedGUID = [];
    guidParser.parse(userId, parsedGUID);
    var opts = {
        filter: new ActiveDirectory.filters.EqualityFilter({
            attribute: 'objectGUID',
            value: parsedGUID
        })
    };
    return ad.find(opts).then(results => {
        if (!results || !results.users || results.users.length == 0)
            return null;
        return formatLDAPData(results.users[0]);
    }, rejected => null).catch(exception => null);
};
function formatLDAPData(data) {
    var result = {
        id: data.objectGUID,
        title: '',
        locationId: formatForEmptyString(data.departmentnumber),
        jobTitle: formatForEmptyString(data.title),
        firstName: formatForEmptyString(data.givenName),
        middleName: formatForEmptyString(data.initials),
        lastName: formatForEmptyString(data.sn),
        username: formatForEmptyString(data.sAMAccountName),
        //domain: 'la-archdiocese.org',// 8
        departmentName: formatForEmptyString(data.department),
        managerName: formatManagerName(data.manager),
        fullName: formatForEmptyString(data.cn),
        phone: formatForEmptyString(data.telephonenumber),
        directReports: formatForEmptyNum(data.directreports),
        email: formatForEmptyString(data.mail),
        distinguishedName: formatForEmptyString(data.distinguishedName),
        assignmentIds: []
    };
    //let assignmentIds
    return result;
}
function formatForEmptyString(value) {
    return (value) ? value.trim() : '';
}
function formatForEmptyNum(value) {
    return (value) ? value.length : 0;
}
function formatManagerName(manager) {
    if (manager && manager.length > 0) {
        return manager.substring(manager.indexOf('=') + 1, manager.indexOf(','));
    }
    return '';
}
passport.use(new WindowsStrategy(config.windowsauth, (user, done) => {
    if (user) {
        return done(null, user);
    }
    else
        return done(null, false);
}));
router.post('/login', passport.authenticate('WindowsAuthentication', { session: false }), (req, res) => { res.json({ user: req.user }); });
router.post('/authenticate', (req, res) => {
    ad.authenticate(req.body.username, req.body.password).then(authentication => {
        let token = jwt.sign(req.body.username, config.secret);
        res.json({
            error: null,
            result: token
        });
    }).catch(exception => {
        res.json({
            error: exception
        });
    });
});
exports.router = router;
exports.getUser = getUser;
const isAdmin = (username) => {
    return ad.isUserMemberOf(username, 'Applied Technology')
        .then(result => {
        return {
            error: null,
            result: result
        };
    })
        .catch(exception => {
        return {
            error: exception
        };
    });
};
const checkAuthorization = exports.checkAuthorization = (token) => {
    if (!token)
        return Promise.reject();
    return promisify(jwt.verify)(token, config.secret);
};
const checkAdminAuthorization = exports.checkAdminAuthorization = (token) => {
    if (!token)
        return Promise.reject();
    return promisify(jwt.verify)(token, config.secret)
        .then(username => isAdmin(username));
};
//# sourceMappingURL=users.js.map
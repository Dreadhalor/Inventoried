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
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
let ad = new ADPromise(config.activedirectory2);
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
exports.router = router;
exports.getUser = getUser;
//# sourceMappingURL=users.js.map
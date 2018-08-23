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
const ActiveDirectory = require('activedirectory2');
let ad; // = new ActiveDirectory(config.activedirectory2);
router.get('/get_all_users', (req, res) => __awaiter(this, void 0, void 0, function* () {
    ad = new ActiveDirectory(config.activedirectory2);
    ad.findUsers((err, users) => {
        if (err)
            return res.send('ERROR: ' + JSON.stringify(err));
        if ((!users) || (users.length == 0))
            return res.send('No users found.');
        return res.json(users.map(user => formatLDAPData(user)));
    });
    ad = null;
}));
module.exports = router;
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
//# sourceMappingURL=users.js.map
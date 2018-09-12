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
const Users = require('../models/tables/Users');
const History = require('./history');
let ad = new ADPromise(config.activedirectory2);
let jwt = require('jsonwebtoken');
let promisify = require('util').promisify;
const passport = require("passport");
router.get('/get_all_users', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let promises = [
        ad.findUsers({ paged: true }),
        Users.pullAll()
    ];
    Promise.all(promises)
        .then(success => {
        let adUsers = success[0];
        let dbUsers = success[1];
        if (adUsers.length == 0)
            res.json('No users found.');
        else {
            adUsers = adUsers.map(user => formatLDAPData(user))
                .map(user => {
                let found = dbUsers.find(match => match.id == user.id);
                if (found)
                    user.assignmentIds = found.assignmentIds;
                return user;
            });
            res.json(adUsers);
        }
    })
        .catch(exception => res.json(exception));
}));
const getUserAD = (userId) => {
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
const getUserDB = (userId) => {
    return Users.findById(userId)
        .catch(exception => null);
};
const getUser = exports.getUser = (userId) => {
    let promises = [
        getUserAD(userId),
        getUserDB(userId)
    ];
    return Promise.all(promises)
        .then(success => {
        let adUser = success[0];
        let dbUser = success[1];
        let result;
        if (adUser) {
            if (dbUser)
                adUser.assignmentIds = dbUser.assignmentIds;
            result = adUser;
        }
        return result;
    });
};
const getUserByUsername = (username) => {
    return ad.findUser(username).then(results => formatLDAPData(results)).catch(exception => null);
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
        let token = jwt.sign(req.body.username.toLowerCase(), config.secret);
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
            result: (result) ? username : false
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
    return checkAuthorization(token)
        .then(username => isAdmin(username));
};
const saveUser = exports.saveUser = (user, authorization) => {
    return checkAdminAuthorization(authorization)
        .catch(exception => 'User is not authorized for this.')
        .then(admin => {
        if (user)
            return Users.save(user, admin.result);
        throw 'No user to save.';
    });
};
const checkin = exports.checkin = (userId, assignmentId, agent) => {
    if (userId)
        return getUser(userId)
            .then(user => {
            for (let i = user.assignmentIds.length - 1; i >= 0; i--) {
                if (user.assignmentIds[i] == assignmentId)
                    user.assignmentIds.splice(i, 1);
            }
            return user;
        })
            .then(moddedUser => {
            let userToSave = {
                id: moddedUser.id,
                assignmentIds: moddedUser.assignmentIds
            };
            return Users.save(userToSave, agent);
        });
    else
        throw 'No user to check in item from.';
};
//# sourceMappingURL=users.js.map
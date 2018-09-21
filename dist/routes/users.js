"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var config = require('../program-config');
var guidParser = require('../utilities/guid-parse');
var WindowsStrategy = require('passport-windowsauth');
var ActiveDirectory = require('activedirectory2');
var ADPromise = ActiveDirectory.promiseWrapper;
var ad = new ADPromise(config.activedirectory2);
var Users = require('../models/tables').Users;
var jwt = require('jsonwebtoken');
var auth = require('../utilities/auth');
var PromisePlus = require('@dreadhalor/bluebird-plus');
var passport = require("passport");
router.get('/get_all_users', function (req, res) {
    var authorization = req.headers.authorization;
    auth.checkAdminAuthorization(authorization, 'Fetch users error')
        .broken(function (error) { return res.json(error); })
        .then(function (authorized) {
        var promises = [
            ad.findUsers({ paged: true }),
            Users.pullAll()
        ];
        return Promise.all(promises);
    })
        .then(function (success) {
        var adUsers = success[0];
        var dbUsers = success[1];
        if (adUsers.length == 0)
            throw 'No users found.';
        else {
            adUsers = adUsers.map(function (user) { return formatLDAPData(user); })
                .map(function (user) {
                var found = dbUsers.find(function (match) { return match.id == user.id; });
                if (found)
                    user.assignmentIds = found.assignmentIds;
                return user;
            });
            res.json(adUsers);
        }
    })
        .catch(function (exception) { return res.json(exception); });
});
var getUserAD = function (userId) {
    var parsedGUID = [];
    guidParser.parse(userId, parsedGUID);
    var opts = {
        filter: new ActiveDirectory.filters.EqualityFilter({
            attribute: 'objectGUID',
            value: parsedGUID
        })
    };
    return ad.find(opts).then(function (results) {
        if (!results || !results.users || results.users.length == 0)
            return null;
        return formatLDAPData(results.users[0]);
    }, function (rejected) { return null; }).catch(function (exception) { return null; });
};
var getUserDB = function (userId) {
    return Users.findById(userId)
        .catch(function (exception) { return null; });
};
var getUser = exports.getUser = function (userId) {
    var promises = [
        getUserAD(userId),
        getUserDB(userId)
    ];
    return Promise.all(promises)
        .then(function (success) {
        var adUser = success[0];
        var dbUser = success[1];
        var result;
        if (adUser) {
            if (dbUser)
                adUser.assignmentIds = dbUser.assignmentIds;
            result = adUser;
        }
        return result;
    });
};
var getUserByUsername = function (username) {
    return ad.findUser(username).then(function (results) { return formatLDAPData(results); }).catch(function (exception) { return null; });
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
passport.use(new WindowsStrategy(config.windowsauth, function (user, done) {
    if (user) {
        return done(null, user);
    }
    else
        return done(null, false);
}));
router.post('/login', passport.authenticate('WindowsAuthentication', { session: false }), function (req, res) { res.json({ user: req.user }); });
router.post('/authenticate', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    auth.authenticate(username, password)
        .broken(function (error) { return res.json(error); })
        .then(function (authenticated) { return ad.getGroupMembershipForUser(username); })
        .then(function (groups) {
        var payload = {
            username: req.body.username.toLowerCase(),
            groups: groups.map(function (group) { return group.cn; })
        };
        var token = jwt.sign(payload, config.secret);
        res.json({
            error: null,
            result: token
        });
    })
        .catch(function (error) { return res.json({
        error: 'Login error',
        message: JSON.stringify(error)
    }); });
});
router.post('/groups', function (req, res) {
    /*ad.findGroups('CN=*').then(
      yes => res.json(yes)
    ).catch(error => res.json(error));*/
    var username = req.body.username;
    /*ad.isUserMemberOf(username, 'Employees at Applied Technology')
    .then(result => {
      res.json({
        error: null,
        result: (result) ? username : false
      })
    })
    .catch(exception => {
      res.json({
        error: exception
      })
    })*/
    ad.getGroupMembershipForUser(username)
        .then(function (result) {
        res.json({
            error: null,
            result: result.map(function (group) { return group.cn; })
        });
    })
        .catch(function (exception) {
        res.json({
            error: exception
        });
    });
});
exports.router = router;
exports.getUser = getUser;
var saveUser = exports.saveUser = function (user, agent) {
    if (user)
        return Users.save(user, agent);
    throw 'No user to save.';
};
var checkin = exports.checkin = function (userId, assignmentId, agent) {
    if (userId)
        return getUser(userId)
            .then(function (user) {
            for (var i = user.assignmentIds.length - 1; i >= 0; i--) {
                if (user.assignmentIds[i] == assignmentId)
                    user.assignmentIds.splice(i, 1);
            }
            return user;
        })
            .then(function (moddedUser) {
            var userToSave = {
                id: moddedUser.id,
                assignmentIds: moddedUser.assignmentIds
            };
            return Users.save(userToSave, agent);
        });
    else
        throw 'No user to check in item from.';
};
//# sourceMappingURL=users.js.map
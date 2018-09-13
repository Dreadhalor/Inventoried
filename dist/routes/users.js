"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var config = require('../program-config');
var guidParser = require('../guid-parse');
var WindowsStrategy = require('passport-windowsauth');
var ActiveDirectory = require('activedirectory2');
var ADPromise = ActiveDirectory.promiseWrapper;
var Users = require('../models/tables/Users');
var History = require('./history');
var ad = new ADPromise(config.activedirectory2);
var jwt = require('jsonwebtoken');
var promisify = require('util').promisify;
var passport = require("passport");
router.get('/get_all_users', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var promises;
    return __generator(this, function (_a) {
        promises = [
            ad.findUsers({ paged: true }),
            Users.pullAll()
        ];
        Promise.all(promises)
            .then(function (success) {
            var adUsers = success[0];
            var dbUsers = success[1];
            if (adUsers.length == 0)
                res.json('No users found.');
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
        return [2 /*return*/];
    });
}); });
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
    ad.authenticate(req.body.username, req.body.password).then(function (authentication) {
        var token = jwt.sign(req.body.username.toLowerCase(), config.secret);
        res.json({
            error: null,
            result: token
        });
    }).catch(function (exception) {
        res.json({
            error: exception
        });
    });
});
exports.router = router;
exports.getUser = getUser;
var isAdmin = function (username) {
    return ad.isUserMemberOf(username, 'Applied Technology')
        .then(function (result) {
        return {
            error: null,
            result: (result) ? username : false
        };
    })
        .catch(function (exception) {
        return {
            error: exception
        };
    });
};
var checkAuthorization = exports.checkAuthorization = function (token) {
    if (!token)
        return Promise.reject();
    return promisify(jwt.verify)(token, config.secret);
};
var checkAdminAuthorization = exports.checkAdminAuthorization = function (token) {
    return checkAuthorization(token)
        .then(function (username) { return isAdmin(username); });
};
var saveUser = exports.saveUser = function (user, authorization) {
    return checkAdminAuthorization(authorization)
        .catch(function (exception) { return 'User is not authorized for this.'; })
        .then(function (admin) {
        if (user)
            return Users.save(user, admin.result);
        throw 'No user to save.';
    });
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
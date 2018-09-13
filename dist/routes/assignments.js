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
var assignment_1 = require("../models/classes/assignment");
var moment = require("moment");
var express = require("express");
var router = express.Router();
var Assignments = require('../models/tables/Assignments');
var assets = require('./assets');
var users = require('./users');
var config = require('../config');
router.get('/get_assignments', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.send('Unauthorized.'); })
        .then(function (admin) { return Assignments.pullAll(); })
        .then(function (assignments) { return res.json(assignments); })
        .catch(function (exception) { return res.json(exception); });
});
router.post('/create_assignment', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.send('Unauthorized.'); })
        .then(function (admin) { return __awaiter(_this, void 0, void 0, function () {
        var assignmentId, userId, assetId, checkoutDate, dueDate, checkoutDateParsed, dueDateParsed, user_1, asset_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assignmentId = req.body.id;
                    userId = req.body.userId;
                    assetId = req.body.assetId;
                    checkoutDate = req.body.checkoutDate;
                    dueDate = req.body.dueDate;
                    if (!(userId && assetId && checkoutDate && dueDate)) return [3 /*break*/, 4];
                    checkoutDateParsed = parseDate(checkoutDate);
                    dueDateParsed = parseDate(dueDate);
                    if (!(checkoutDateParsed && dueDateParsed)) return [3 /*break*/, 2];
                    user_1 = null;
                    asset_1 = null;
                    return [4 /*yield*/, Promise.all([users.getUser(userId), assets.getAsset(assetId)]).then(function (result) {
                            user_1 = result[0];
                            asset_1 = result[1];
                        }).catch(function (exception) {
                            throw exception;
                        })];
                case 1:
                    _a.sent();
                    if (user_1 && asset_1) { //user & asset are both valid objects in the database
                        //All inputs are valid
                        checkout(assignmentId, user_1, asset_1, checkoutDateParsed, dueDateParsed, admin.result, authorization)
                            .then(function (checkedOut) { return res.json(checkedOut); }).catch(function (error) {
                            console.log(error);
                            res.json(error);
                        });
                        //res.json({user,asset});
                    }
                    else
                        res.send('User and asset are not both valid.');
                    return [3 /*break*/, 3];
                case 2:
                    res.send('Dates are not both valid.');
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    res.send('Not all fields are present.');
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); })
        .catch(function (exception) { return res.json(exception); });
});
router.post('/checkin', function (req, res) {
    var authorization = req.headers.authorization;
    var agent;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.send('Unauthorized.'); })
        .then(function (admin) {
        agent = admin.result;
        var id = req.body.assignmentId;
        return Assignments.findById(id);
    })
        .then(function (assignment) {
        var promises = [
            Assignments.deleteById(assignment.id, agent),
            users.checkin(assignment.userId, assignment.id, agent),
            assets.checkin(assignment.assetId, assignment.id, agent)
        ];
        return Promise.all(promises);
    })
        .then(function (success) { return res.json('success!'); })
        .catch(function (exception) { return res.json(exception); });
});
module.exports = router;
var parseDate = function (date) {
    var parsed = moment(date, config.dateFormat, true);
    if (parsed.isValid()) {
        return parsed;
    }
    return null;
};
var checkout = function (assignmentId, user, asset, checkoutDate, dueDate, agent, authorization) {
    var iassignment = {
        id: assignmentId,
        userId: user.id,
        assetId: asset.asset.id,
        checkoutDate: checkoutDate.format(config.dateFormat),
        dueDate: dueDate.format(config.dateFormat)
    };
    //Implement error checking here for redundant assignments later
    user.assignmentIds.push(assignmentId);
    switch (asset.type) {
        case "durable":
            asset.asset.assignmentId = assignmentId;
            break;
        case "consumable":
            asset.asset.assignmentIds.push(assignmentId);
            break;
    }
    var assignment = new assignment_1.Assignment(iassignment);
    var userToSave = {
        id: user.id,
        assignmentIds: user.assignmentIds
    };
    return Promise.all([
        Assignments.save(assignment, agent),
        assets.saveAsset(asset.asset, authorization),
        users.saveUser(userToSave, authorization)
    ]);
};
//# sourceMappingURL=assignments.js.map
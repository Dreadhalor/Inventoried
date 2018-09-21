"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assignment_1 = require("../models/classes/assignment");
var moment = require("moment");
var express = require("express");
var router = express.Router();
var Promise = require("bluebird");
var PromisePlus = require('@dreadhalor/bluebird-plus');
var PromiseQueue = new PromisePlus.Queue();
var Assignments = require('../models/tables').Assignments;
var assets = require('./assets');
var users = require('./users');
var config = require('../server-config');
var auth = require('../utilities/auth');
router.get('/get_assignments', function (req, res) {
    var authorization = req.headers.authorization;
    auth.authguard(authorization, 'admin', 'Fetch assignments error')
        .broken(function (error) { return res.json(error); })
        .then(function (agent) { return Assignments.pullAll(); })
        .then(function (assignments) { return res.json({
        error: null,
        result: assignments
    }); })
        .catch(function (exception) { return res.json(exception); });
});
router.post('/create_assignment', function (req, res) {
    PromiseQueue.push([req, res], function (args) { return checkoutFxn(args[0], args[1]); });
});
var checkoutFxn = function (req, res) {
    var authorization = req.headers.authorization;
    var assignmentId, userId, assetId, checkoutDate, dueDate, checkoutDateParsed, dueDateParsed, agent;
    return auth.authguard(authorization, 'admin', 'Check out error')
        .broken(function (error) { return res.json(error); })
        .then(function (authorized) {
        agent = authorized;
        assignmentId = req.body.id;
        userId = req.body.userId;
        assetId = req.body.assetId;
        checkoutDate = req.body.checkoutDate;
        dueDate = req.body.dueDate;
        var validDates = checkoutDate && (dueDate || dueDate == '');
        if (userId && assetId && validDates) { //All fields are present
            checkoutDateParsed = parseDate(checkoutDate);
            dueDateParsed = parseDate(dueDate);
            var validParsedDates = checkoutDateParsed && (dueDateParsed || dueDateParsed == '');
            if (validParsedDates) //Checkout date + due date are both valid
                return Promise.all([users.getUser(userId), assets.getAsset(assetId)]);
            else
                throw 'Dates are not both valid.';
        }
        else
            throw 'Not all fields are present.';
    })
        .then(function (result) {
        var user = result[0];
        var asset = result[1];
        if (user && asset) { //user & asset are both valid objects in the database
            //All inputs are valid
            return checkout(assignmentId, user, asset, checkoutDateParsed, dueDateParsed, agent);
        }
        else
            throw 'User and asset are not both valid.';
    })
        .then(function (checkedOut) { return res.json(checkedOut); })
        .catch(function (error) {
        if (typeof error != 'string')
            error = JSON.stringify(error);
        res.json({
            error: {
                title: 'Check out error',
                message: error
            }
        });
    });
};
router.post('/checkin', function (req, res) {
    var authorization = req.headers.authorization;
    var agent;
    auth.authguard(authorization, 'admin', 'Check in error')
        .broken(function (error) { return res.json(error); })
        .then(function (authorized) {
        agent = authorized;
        var id = req.body.assignmentId;
        return Assignments.findById(id);
    })
        .then(function (assignment) {
        var promises = [
            Assignments.deleteById(assignment.id, agent),
            auth.checkin(assignment.userId, assignment.id, agent),
            assets.checkin(assignment.assetId, assignment.id, agent)
        ];
        return Promise.all(promises);
    })
        .catch(function (error) {
        if (typeof error != 'string')
            error = JSON.stringify(error);
        var result = {
            error: {
                title: 'Check in error',
                message: error
            }
        };
        res.json(result);
    });
});
module.exports = router;
var parseDate = function (date) {
    if (date == '')
        return '';
    var parsed = moment(date, config.dateFormat, true);
    if (parsed.isValid()) {
        return parsed;
    }
    return null;
};
var checkout = function (assignmentId, user, asset, checkoutDate, dueDate, agent) {
    var iassignment = {
        id: assignmentId,
        userId: user.id,
        assetId: asset.asset.id,
        checkoutDate: checkoutDate.format(config.dateFormat),
        dueDate: (dueDate) ? dueDate.format(config.dateFormat) : ''
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
        assets.saveAsset(asset.asset, agent),
        users.saveUser(userToSave, agent)
    ]);
};
//# sourceMappingURL=assignments.js.map
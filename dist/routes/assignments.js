"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assignment_1 = require("../models/classes/assignment");
var moment = require("moment");
var express = require("express");
var router = express.Router();
var Promise = require("bluebird");
var Assignments = require('../models/tables/Assignments');
var assets = require('./assets');
var users = require('./users');
var config = require('../program-config');
router.get('/get_assignments', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.send('Unauthorized.'); })
        .then(function (admin) { return Assignments.pullAll(); })
        .then(function (assignments) { return res.json(assignments); })
        .catch(function (exception) { return res.json(exception); });
});
var queue = [];
var running = false;
var addToQueue = function (args, fxn) {
    var pair = {
        args: args,
        fxn: fxn
    };
    queue.push(pair);
    if (!running)
        advanceQueue();
};
var advanceQueue = function () {
    running = true;
    if (queue.length > 0) {
        var pair = queue.pop();
        pair.fxn(pair.args)
            .then(function (success) { return advanceQueue(); })
            .catch(function (error) { return running = false; });
    }
    else
        running = false;
};
router.post('/create_assignment', function (req, res) {
    addToQueue([req, res], function (args) { return checkoutFxn(args[0], args[1]); });
});
var checkoutFxn = function (req, res) {
    var authorization = req.headers.authorization;
    var assignmentId, userId, assetId, checkoutDate, dueDate, checkoutDateParsed, dueDateParsed, agent;
    return users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.send('Unauthorized.'); })
        .then(function (admin) {
        agent = admin.result;
        assignmentId = req.body.id;
        userId = req.body.userId;
        assetId = req.body.assetId;
        checkoutDate = req.body.checkoutDate;
        dueDate = req.body.dueDate;
        if (userId && assetId && checkoutDate && dueDate) { //All fields are present
            checkoutDateParsed = parseDate(checkoutDate);
            dueDateParsed = parseDate(dueDate);
            if (checkoutDateParsed && dueDateParsed) //Checkout date + due date are both valid
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
            return checkout(assignmentId, user, asset, checkoutDateParsed, dueDateParsed, agent, authorization);
        }
        else
            throw 'User and asset are not both valid.';
    })
        .then(function (checkedOut) { return res.json(checkedOut); })
        .catch(function (error) {
        console.log(error);
        res.json(error);
    });
};
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
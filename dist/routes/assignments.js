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
const assignment_1 = require("../models/classes/assignment");
const moment = require("moment");
const express = require("express");
const router = express.Router();
const Assignments = require('../models/tables/Assignments');
const assets = require('./assets');
const users = require('./users');
const config = require('../config');
router.get('/get_assignments', (req, res) => {
    let authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(unauthorized => res.send('Unauthorized.'))
        .then(admin => Assignments.pullAll())
        .then(assignments => res.json(assignments))
        .catch(exception => res.json(exception));
});
router.post('/create_assignment', (req, res) => {
    let authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(unauthorized => res.send('Unauthorized.'))
        .then((admin) => __awaiter(this, void 0, void 0, function* () {
        let assignmentId = req.body.id;
        let userId = req.body.userId;
        let assetId = req.body.assetId;
        let checkoutDate = req.body.checkoutDate;
        let dueDate = req.body.dueDate;
        if (userId && assetId && checkoutDate && dueDate) { //All fields are present
            let checkoutDateParsed = parseDate(checkoutDate);
            let dueDateParsed = parseDate(dueDate);
            if (checkoutDateParsed && dueDateParsed) { //Checkout date + due date are both valid
                let user = null;
                let asset = null;
                yield Promise.all([users.getUser(userId), assets.getAsset(assetId)]).then(result => {
                    user = result[0];
                    asset = result[1];
                }).catch(exception => {
                    throw exception;
                });
                if (user && asset) { //user & asset are both valid objects in the database
                    //All inputs are valid
                    checkout(assignmentId, user, asset, checkoutDateParsed, dueDateParsed, admin.result, authorization)
                        .then(checkedOut => res.json(checkedOut)).catch(error => {
                        console.log(error);
                        res.json(error);
                    });
                    //res.json({user,asset});
                }
                else
                    res.send('User and asset are not both valid.');
            }
            else
                res.send('Dates are not both valid.');
        }
        else
            res.send('Not all fields are present.');
    }))
        .catch(exception => res.json(exception));
});
router.post('/checkin', (req, res) => {
    let authorization = req.headers.authorization;
    let agent;
    users.checkAdminAuthorization(authorization)
        .catch(unauthorized => res.send('Unauthorized.'))
        .then(admin => {
        agent = admin.result;
        let id = req.body.assignmentId;
        return Assignments.findById(id);
    })
        .then(assignment => {
        let promises = [
            Assignments.deleteById(assignment.id, agent),
            users.checkin(assignment.userId, assignment.id, agent),
            assets.checkin(assignment.assetId, assignment.id, agent)
        ];
        return Promise.all(promises);
    })
        .then(success => res.json('success!'))
        .catch(exception => res.json(exception));
});
module.exports = router;
const parseDate = (date) => {
    let parsed = moment(date, config.dateFormat, true);
    if (parsed.isValid()) {
        return parsed;
    }
    return null;
};
const checkout = (assignmentId, user, asset, checkoutDate, dueDate, agent, authorization) => {
    let iassignment = {
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
    let assignment = new assignment_1.Assignment(iassignment);
    let userToSave = {
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
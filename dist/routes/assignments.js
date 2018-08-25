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
const moment = require("moment");
const express = require("express");
const router = express.Router();
const dbClient = require('../models/classes/db-client');
const assets = require('./assets');
const users = require('./users');
const config = require('../config');
router.post('/create_assignment', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            }).catch(exception => null);
            if (user && asset) { //user & asset are both valid objects in the database
                //All inputs are valid
                res.json(yield checkout(user, asset, checkoutDateParsed, dueDateParsed));
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
}));
module.exports = router;
const parseDate = (date) => {
    let parsed = moment(date, config.dateFormat, true);
    if (parsed.isValid()) {
        return parsed;
    }
    return null;
};
const getAssignmentIds = (userId) => {
    //dbClient.
};
const checkout = (user, asset, checkoutDate, dueDate) => {
    return dbClient.getAssignmentIds(user.id);
};
//Consumable
/*
assign(assignmentId: string): void {
  if (!this.assignmentIds.includes(assignmentId))
    this.assignmentIds.push(assignmentId);
}
unassign(assignmentId: string): void {
  for (let i = this.assignmentIds.length; i >= 0; i--){
    if (this.assignmentIds[i] == assignmentId) this.assignmentIds.splice(i,1);
  }
}*/
//Durable
/*
assign(assignmentId){
  this.assignmentId = assignmentId;
}
unassign(assignmentId){
  if (this.assignmentId == assignmentId) this.assignmentId = '0';
}
*/ 
//# sourceMappingURL=assignments.js.map
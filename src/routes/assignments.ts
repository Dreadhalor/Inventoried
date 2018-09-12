import { Assignment } from '../models/classes/assignment';
import { IAssignment } from '../models/interfaces/IAssignment';
import * as moment from 'moment';
import * as express from 'express';
const router = express.Router();

const Assignments = require('../models/tables/Assignments');

const assets = require('./assets');
const users = require('./users');
const config = require('../config');

router.post('/create_assignment', async (req, res) => {
  let authorization = req.headers.authorization;
  let assignmentId = req.body.id;
  let userId = req.body.userId;
  let assetId = req.body.assetId;
  let checkoutDate = req.body.checkoutDate;
  let dueDate = req.body.dueDate;
  if (userId && assetId && checkoutDate && dueDate){ //All fields are present
    let checkoutDateParsed = parseDate(checkoutDate);
    let dueDateParsed = parseDate(dueDate);
    if (checkoutDateParsed && dueDateParsed){ //Checkout date + due date are both valid
      let user = null;
      let asset = null;
      await Promise.all([users.getUser(userId), assets.getAsset(assetId)]).then(
        result => {
          user = result[0];
          asset = result[1];
        }
      ).catch(exception => null);
      if (user && asset){ //user & asset are both valid objects in the database
        //All inputs are valid
        checkout(assignmentId, user, asset, checkoutDateParsed, dueDateParsed, authorization)
          .then(
            checkedOut => res.json(checkedOut)
          ).catch(error => {
            console.log(error);
            res.json(error);
          })
        //res.json({user,asset});
      } else res.send('User and asset are not both valid.')
    }
    else res.send('Dates are not both valid.');
  }
  else res.send('Not all fields are present.');
})

module.exports = router;

const parseDate = (date: string): moment.Moment => {
  let parsed = moment(date, config.dateFormat, true);
  if (parsed.isValid()){
    return parsed;
  }
  return null;
}

const checkout = (assignmentId, user, asset, checkoutDate: moment.Moment, dueDate: moment.Moment, authorization) => {
  let iassignment: IAssignment = {
    id: assignmentId,
    userId: user.id,
    assetId: asset.asset.id,
    checkoutDate: checkoutDate.format(config.dateFormat),
    dueDate: dueDate.format(config.dateFormat)
  }
  //Implement error checking here for redundant assignments later
  user.assignmentIds.push(assignmentId);
  switch(asset.type){
    case "durable":
      asset.asset.assignmentId = assignmentId;
      break;
    case "consumable":
      asset.asset.assignmentIds.push(assignmentId);
      break;
  }
  let assignment = new Assignment(iassignment);
  let userToSave = {
    id: user.id,
    assignmentIds: user.assignmentIds
  };
  return Promise.all([
    Assignments.save(assignment),
    assets.saveAsset(asset.asset, authorization),
    users.saveUser(userToSave, authorization)
  ]);



}

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
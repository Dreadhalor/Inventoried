import { Assignment } from '../models/classes/assignment';
import { IAssignment } from '../models/interfaces/IAssignment';
import * as moment from 'moment';
import * as express from 'express';
const router = express.Router();
import * as Promise from 'bluebird';
const PromisePlus = require('@dreadhalor/bluebird-plus');
const PromiseQueue = new PromisePlus.Queue();

const Assignments = require('../models/tables').Assignments;

const assets = require('./assets');
const users = require('./users');
const config = require('../server-config');
const auth = require('../utilities/auth');
const err = require('../utilities/error');

router.get('/get_assignments', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Fetch assignments error')
    .broken(error => res.json(error))
    .then(agent => Assignments.pullAll())
    .then(assignments => res.json({
      error: null,
      result: assignments
    }))
    .catch(error => res.json(err.formatError(error, 'Fetch assignments error')));
})

router.post('/create_assignment', (req, res) => {
  PromiseQueue.push([req,res], (args) => checkoutFxn(args[0], args[1]));
})
const checkoutFxn = (req, res) => {
  let authorization = req.headers.authorization;
  let assignmentId, userId, assetId, checkoutDate, dueDate, checkoutDateParsed, dueDateParsed, agent;
  return auth.authguard(authorization, 'admin', 'Check out error')
    .broken(error => res.json(error))
    .then(authorized => {
      agent = authorized;
      assignmentId = req.body.id;
      userId = req.body.userId;
      assetId = req.body.assetId;
      checkoutDate = req.body.checkoutDate;
      dueDate = req.body.dueDate;
      let validDates = checkoutDate && (dueDate || dueDate == '');
      if (userId && assetId && validDates){ //All fields are present
        checkoutDateParsed = parseDate(checkoutDate);
        dueDateParsed = parseDate(dueDate);
        let validParsedDates = checkoutDateParsed && (dueDateParsed || dueDateParsed == '');
        if (validParsedDates)//Checkout date + due date are both valid
          return Promise.all([users.getUser(userId), assets.getAsset(assetId)])
        else throw 'Dates are not both valid.';
      } else throw 'Not all fields are present.';
    })
    .then(result => {
      let user = result[0];
      let asset = result[1];
      if (user && asset){ //user & asset are both valid objects in the database
        //All inputs are valid
        return checkout(assignmentId, user, asset, checkoutDateParsed, dueDateParsed, agent)
      } else throw 'User and asset are not both valid.';
    })
    .then(checkedOut => res.json({
      error: null,
      result: checkedOut
    }))
    .catch(error => res.json(err.formatError(error, 'Check out error')))
}
router.post('/checkin', (req, res) => {
  let authorization = req.headers.authorization;
  let agent;
  auth.authguard(authorization, 'admin', 'Check in error')
    .broken(error => res.json(error))
    .then(authorized => {
      agent = authorized;
      let id = req.body.assignmentId;
      return Assignments.findById(id)
    })
    .then(assignment => {
      let promises = [
        users.checkin(assignment.userId, assignment.id, agent),
        assets.checkin(assignment.assetId, assignment.id, agent),
        Assignments.deleteById(assignment.id, agent)
      ];
      return Promise.all(promises);
    })
    .then(checkedIn => res.json({
      error: null,
      result: checkedIn
    }))
    .catch(error => res.json(err.formatError(error, 'Check in error')));
})

module.exports = router;

const parseDate = (date: string) => {
  if (date == '') return '';
  let parsed = moment(date, config.dateFormat, true);
  if (parsed.isValid()){
    return parsed;
  }
  return null;
}

const checkout = (assignmentId, user, asset, checkoutDate: moment.Moment, dueDate: moment.Moment, agent) => {
  let iassignment: IAssignment = {
    id: assignmentId,
    userId: user.id,
    assetId: asset.asset.id,
    checkoutDate: checkoutDate.format(config.dateFormat),
    dueDate: (dueDate) ? dueDate.format(config.dateFormat) : ''
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
    Assignments.save(assignment, agent),
    assets.saveAsset(asset.asset, agent),
    users.saveUser(userToSave, agent)
  ]);

}
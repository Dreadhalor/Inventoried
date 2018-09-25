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
router.post('/checkout', (req, res) => {
  let authorization = req.headers.authorization;
  let assignments = req.body.assignments;
  let agent;
  let assignmentsToSave = [], usersToSave = [], assetsToSave = [];
  return auth.authguard(authorization, 'admin', 'Check out error')
    .broken(error => res.json(error))
    .then(authorized => {
      agent = authorized;
      let valid = !!assignments.map(assignment => verifyCheckoutInfo(assignment)).reduce((a,b) => a && b);
      if (valid) return true;
      throw 'Error with checkout dates.';
    })
    .then(valid => Promise.all(assignments.map(assignment => Promise.all([users.getUser(assignment.userId), assets.getAsset(assignment.assetId)]))))
    .then(results => {
      let valid = results.map(pair => pair.reduce((a,b) => a && b)).reduce((a,b) => a && b);
      if (valid){
        for (let i = 0; i < results.length; i++){
          let user = results[i][0];
          let asset = results[i][1];
          let assignment = assignments[i];

          let userExists = usersToSave.find(match => match.id == user.id);
          if (userExists) user = userExists;
          else usersToSave.push(users.saveFormat(user));
          user.assignmentIds.push(assignment.id);

          let type = asset.type;
          asset = asset.asset;
          let assetExists = assetsToSave.find(match => match.id == asset.id);
          if (assetExists) asset = assetExists;
          else assetsToSave.push(asset);
          switch(type){
            case "durable":
              asset.assignmentId = assignment.id;
              break;
            case "consumable":
              asset.assignmentIds.push(assignment.id);
              break;
          }

          assignmentsToSave.push(assignment);
        }
        let promises = [
          users.saveUsers(usersToSave, agent),
          assets.saveAssets(assetsToSave, agent),
          Assignments.save(assignmentsToSave, agent)
        ];
        return Promise.all(promises);
      } else throw 'Error with user or asset availability.';
    })
    .then(checkedOut => res.json({
      error: null,
      result: checkedOut
    }))
    .catch(error => res.json(err.formatError(error, 'Check out error')))
})
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

const getAssignment = module.exports.getAssignment = (id: string) => {
  return Assignments.findById(id);
}

const parseDate = (date: string) => {
  if (date == '') return '';
  let parsed = moment(date, config.dateFormat, true);
  if (parsed.isValid()){
    return parsed;
  }
  return null;
}
const verifyCheckoutInfo = assignment => {
  let id = assignment.id;
  let userId = assignment.userId;
  let assetId = assignment.assetId;
  let checkoutDate = assignment.checkoutDate;
  let dueDate = assignment.dueDate;
  if (id && userId && assetId && checkoutDate && (dueDate || dueDate == '')){
    let checkoutDateValid = parseDate(checkoutDate);
    let dueDateValid = dueDate == '' || parseDate(dueDate);
    return checkoutDateValid && dueDateValid;
  } return false;
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
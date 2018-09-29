import { IUser } from "../models/interfaces/IUser";

const express = require('express');
const router = express.Router();
const config = require('../server-config');
const guidParser = require('../utilities/guid-parse');
const WindowsStrategy = require('passport-windowsauth');
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
const ad = new ADPromise(config.activedirectory2);
const Users = require('../models/tables').Users;
const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');
const err = require('../utilities/error');

import * as passport from 'passport';

router.get('/get_all_users', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Fetch users error')
    .broken(error => res.json(error))
    .then(authorized => {
      let promises = [
        ad.findUsers({paged: true}),
        Users.pullAll()
      ]
      return Promise.all(promises)
    })
    .then(success => {
      let adUsers = success[0];
      let dbUsers = success[1];
      if (adUsers.length == 0) throw 'No users found.';
      else {
        adUsers = adUsers.map(user => formatLDAPData(user))
          .map(user => {
            let found = dbUsers.find(match => match.id == user.id);
            if (found) user.assignmentIds = found.assignmentIds;
            return user;
          });
        res.json(adUsers);
      }
    })
    .catch(error => res.json(err.formatError(error, 'Fetch users error')));
});

const getUserAD = (userId: string) => {
  let parsedGUID = [];
  guidParser.parse(userId,parsedGUID);
  
  var opts = {
    filter : new ActiveDirectory.filters.EqualityFilter({
      attribute: 'objectGUID',
      value: parsedGUID
    })
  };

  return ad.find(opts).then(
    results => {
      if (!results || !results.users || results.users.length == 0)
        return null;
      return formatLDAPData(results.users[0]);
    },
    rejected => null
  ).catch(exception => null);
};
const getUserDB = (userId: string) => {
  return Users.findById(userId)
    .catch(exception => null);
}
const getUser = exports.getUser = (userId: string) => {
  let promises = [
    getUserAD(userId),
    getUserDB(userId)
  ]
  return Promise.all(promises)
    .then(success => {
      let adUser = success[0];
      let dbUser = success[1];
      let result;
      if (adUser){
        if (dbUser) adUser.assignmentIds = dbUser.assignmentIds;
        result = adUser;
      }
      return result;
    })
}

const getUserByUsername = (username: string) => {
  return ad.findUser(username).then(
    results => formatLDAPData(results)
  ).catch(exception => null);
}

function formatLDAPData(data: any){
  var result: IUser = {
    id: data.objectGUID,
    title: '', // 1
    locationId: formatForEmptyString(data.departmentnumber), // 2
    jobTitle: formatForEmptyString(data.title),// 3
    firstName: formatForEmptyString(data.givenName),// 4
    middleName: formatForEmptyString(data.initials),// 5
    lastName: formatForEmptyString(data.sn),// 6
    username: formatForEmptyString(data.sAMAccountName),// 7
    //domain: 'la-archdiocese.org',// 8
    departmentName: formatForEmptyString(data.department),// 9
    managerName: formatManagerName(data.manager),// 10
    fullName: formatForEmptyString(data.cn),// 11
    phone: formatForEmptyString(data.telephonenumber),// 12
    directReports: formatForEmptyNum(data.directreports), //14
    email: formatForEmptyString(data.mail),
    distinguishedName: formatForEmptyString(data.distinguishedName),
    assignmentIds: []
  };
  //let assignmentIds
  return result;
}

function formatForEmptyString(value: string): string{
  return (value) ? value.trim() : '';
}
function formatForEmptyNum(value: any[]): number{
  return (value) ? value.length : 0;
}
function formatManagerName(manager: string){
  if (manager && manager.length > 0){
    return manager.substring(manager.indexOf('=') + 1, manager.indexOf(','));
  }
  return '';
}

passport.use(new WindowsStrategy(
  config.windowsauth,
  (user, done) => {
    if (user) {
      return done(null, user);
    } else return done(null, false);
  }
));

router.post('/login',
  passport.authenticate('WindowsAuthentication', {session: false}),
  (req, res) => { res.json({user: req.user}); }
);

router.post('/authenticate', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  auth.authenticate(username, password)
    .broken(error => res.json(error))
    .then(authenticated => ad.getGroupMembershipForUser(username))
    .then(groups => {
      let payload = {
        username: req.body.username.toLowerCase(),
        groups: groups.map(group => group.cn)
      };
      let token = jwt.sign(payload, config.secret);
      res.json({
        error: null,
        result: token
      });
    })
    .catch(error => res.json(err.formatError(error, 'Login error')));
})

exports.router = router;
exports.getUser = getUser;

const saveUser = exports.saveUser = (user, agent) => {
  if (user) return Users.save(user, agent);
  throw 'No user to save.';
}
const saveFormat = exports.saveFormat = (user) => {
  return {
    id: user.id,
    assignmentIds: user.assignmentIds
  };
}
const checkin = exports.checkin = (userId, assignmentId, agent) => {
  if (userId) return getUser(userId)
    .then(user => {
      for (let i = user.assignmentIds.length - 1; i >= 0; i--){
        if (user.assignmentIds[i] == assignmentId)
          user.assignmentIds.splice(i,1);
      }
      return user;
    })
    .then(moddedUser => {
      let userToSave = {
        id: moddedUser.id,
        assignmentIds: moddedUser.assignmentIds
      };
      return Users.save(userToSave, agent);
    })
  else throw 'No user to check in item from.';
}
const saveUsers = exports.saveUsers = (users, agent?: string) => {
  if (!Array.isArray(users)){
    let array = [];
    array.push(users);
    users = array;
  }
  return Users.save(users, agent);
}
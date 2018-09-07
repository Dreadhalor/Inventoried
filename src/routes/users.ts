import { IUser } from "../models/interfaces/IUser";

const express = require('express');
const router = express.Router();
const config = require('../config');
const guidParser = require('../guid-parse');
const WindowsStrategy = require('passport-windowsauth');
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
let ad = new ADPromise(config.activedirectory2);
let jwt = require('jsonwebtoken');
let promisify = require('util').promisify;

import * as passport from 'passport';

router.get('/get_all_users', async (req, res) => {
  ad.findUsers({paged: false}).then(
    users => {
      if (users.length == 0) res.json('No users found.');
      else res.json(users.map(user => formatLDAPData(user)));
    },
    rejected => res.json(rejected)
  ).catch(exception => res.json(exception));
});

const getUser = (userId: string) => {
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
  ad.authenticate(req.body.username, req.body.password).then(
    authentication => {
      let token = jwt.sign(req.body.username, config.secret);
      res.json({
        error: null,
        result: token
      });
    }
  ).catch(exception => {
    res.json({
      error: exception
    });
  });
})

exports.router = router;
exports.getUser = getUser;

const isAdmin = (username: string) => {
  return ad.isUserMemberOf(username, 'Applied Technology')
  .then(result => {
    return {
      error: null,
      result: result
    }
  })
  .catch(exception => {
    return {
      error: exception
    }
  })
}

const checkAuthorization = exports.checkAuthorization = (token: string) => {
  if (!token) return Promise.reject();
  return promisify(jwt.verify)(token, config.secret);
}
const checkAdminAuthorization = exports.checkAdminAuthorization = (token: string) => {
  if (!token) return Promise.reject();
  return promisify(jwt.verify)(token, config.secret)
    .then(username => isAdmin(username));
}
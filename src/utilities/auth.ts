const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const PromisePlus = require('@dreadhalor/bluebird-plus');
const UserRoles = require('../../config.json').shared.roles;
const config = require('../server-config');
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
const ad = new ADPromise(config.activedirectory2);
const err = require('./error');

const getGroups = (username: string) => {
  return ad.getGroupMembershipForUser(username)
    .then(result => result.map(group => group.cn));
}

const authenticate = exports.authenticate = (username, password) => {
  return PromisePlus.convertToBreakable(ad.authenticate(username, password))
    .break(unauthorized => err.formatError('Invalid credentials.', 'Login error'))
}

const decodeToken = exports.decodeToken = (token: string, role?: string) => {
  let result;
  if (!token) result = Promise.reject();
  else result = promisify(jwt.verify)(token, config.secret);
  return PromisePlus.convertToBreakable(result);
}

const authguard = exports.authguard = (token: string, role: string, title?: string) => {
  let username;
  let result = decodeToken(token)
    .then(payload => {
      username = payload.username;
      return getGroups(payload.username)
    })
    .break(invalid => 'Invalid login token.')
    .then(groups => groups.includes(UserRoles[role]))
    .then(rolecheck => {
      if (!rolecheck) throw 'Unauthorized.';
      return username;
    })
    .break(error => error)
  if (title) return result.broken(errorMsg => err.formatError(errorMsg, title))
  return result;
}
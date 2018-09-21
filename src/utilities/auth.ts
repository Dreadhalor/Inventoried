const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const PromisePlus = require('@dreadhalor/bluebird-plus');
const config = require('../program-config');
const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
const ad = new ADPromise(config.activedirectory2);

const authenticate = exports.authenticate = (username, password) => {
  return PromisePlus.convertToBreakable(ad.authenticate(username, password))
    .break(unauthorized => {
      let error = {
        error: {
          title: 'Login error',
          message: 'Invalid credentials'
        }
      }
      return error;
    })
}

const checkAuthorization = exports.checkAuthorization = (token: string) => {
  let result;
  if (!token) result = Promise.reject();
  else result = promisify(jwt.verify)(token, config.secret);
  return PromisePlus.convertToBreakable(result);
}
const checkAdminAuthorization = exports.checkAdminAuthorization = (token: string, title?: string) => {
  let result = checkAuthorization(token)
    .then(payload => isAdmin(payload.username));
  if (title) {
    let error = {
      error: {
        title: title,
        message: 'Unauthorized.'
      }
    };
    return result.break(unauthorized => error);
  }
  return result;
}

const isAdmin = (username: string) => {
  return ad.isUserMemberOf(username, 'Applied technology')
    .then(result => {
      if (result) return username;
      throw 'Unauthorized.'
    })
}
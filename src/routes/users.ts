import { IUser } from "../models/interfaces/IUser";

const express = require('express');
const router = express.Router();
const config = require('../config');
const guidParser = require('../guid-parse');

const ActiveDirectory = require('activedirectory2');
const ADPromise = ActiveDirectory.promiseWrapper;
let ad = new ADPromise(config.activedirectory2);

router.get('/get_all_users', async (req, res) => {
  ad.findUsers({paged: true}).then(
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
    includeMembership: ['wewerwe'],
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

exports.router = router;
exports.getUser = getUser;
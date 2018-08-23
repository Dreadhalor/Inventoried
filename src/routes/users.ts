import { IUser } from "../models/interfaces/IUser";

const express = require('express');
const router = express.Router();
const config = require('../config');

const ActiveDirectory = require('activedirectory2');
let ad;// = new ActiveDirectory(config.activedirectory2);

router.get('/get_all_users', async (req, res) => {
  ad = new ActiveDirectory(config.activedirectory2);
  ad.findUsers((err, users) => {
    if (err) return res.send('ERROR: ' + JSON.stringify(err));
    if ((!users) || (users.length == 0)) return res.send('No users found.');
    return res.json(users.map(user => formatLDAPData(user)));
  });
  ad = null;
});

module.exports = router;

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
export module ProgramConfig {
  const path = require('path');
  const fse = require('fs-extra');
  const config = require('./config');
  const guidParser = require('./utilities/guid-parse');

  module.exports = {
    activedirectory2: {
      url: 'ldap://la-archdiocese.org',
      baseDN: 'dc=la-archdiocese,dc=org',
      username: config.ldapUser,
      password: config.ldapUserPassword,
      entryParser: GUIDtoString,
      attributes: {
        user: [
          'objectGUID',
          'departmentnumber', // 2
          'title', // 3
          'givenName', // 4
          'initials', // 5
          'sn', // 6
          'sAMAccountName', // 7
          'department', // 9
          'manager', // 10
          'cn', // 11
          'telephonenumber', //12,
          'distinguishedName', // 12.5
          'directreports', //14
          'mail'
        ]
      }
    },
    mssql: {
      user: config.dbUser,
      password: config.dbUserPassword,
      server: config.dbHost,
      database: config.dbName,
      options: {
        instanceName: config.dbInstance,
        trustedConnection: true
      }
    },
    windowsauth: {
      ldap: {
        url:             'ldap://la-archdiocese.org/"DC=la-archdiocese,DC=org',
        base:            'DC=la-archdiocese,DC=org',
        bindDN:          config.ldapUser,
        bindCredentials: config.ldapUserPassword
      },
      integrated: false,
      usernameField: 'username',
      passwordField: 'password'
    },
    secret: 'secretOrPrivateKey',
    dateFormat: 'MMMM Do YYYY',
    historyFormat: 'dddd, MMMM Do YYYY, h:mm:ss a'
  }

  function GUIDtoString(entry, raw, callback){
    if (raw.hasOwnProperty('objectGUID')){
      entry.objectGUID = guidParser.unparse(raw.objectGUID);
    }
    callback(entry);
  }
}
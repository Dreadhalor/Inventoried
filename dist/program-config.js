"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProgramConfig;
(function (ProgramConfig) {
    var path = require('path');
    var fse = require('fs-extra');
    var config = require('./config');
    var guidParser = require('./utilities/guid-parse');
    module.exports = {
        activedirectory2: {
            url: 'ldap://la-archdiocese.org',
            baseDN: 'dc=la-archdiocese,dc=org',
            username: config.dbUser,
            password: config.dbUserPassword,
            entryParser: GUIDtoString,
            attributes: {
                user: [
                    'objectGUID',
                    'departmentnumber',
                    'title',
                    'givenName',
                    'initials',
                    'sn',
                    'sAMAccountName',
                    'department',
                    'manager',
                    'cn',
                    'telephonenumber',
                    'distinguishedName',
                    'directreports',
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
                url: 'ldap://la-archdiocese.org/"DC=la-archdiocese,DC=org',
                base: 'DC=la-archdiocese,DC=org',
                bindDN: config.dbUser,
                bindCredentials: config.dbUserPassword
            },
            integrated: false,
            usernameField: 'username',
            passwordField: 'password'
        },
        secret: 'secretOrPrivateKey',
        dateFormat: 'MMMM Do YYYY',
        historyFormat: 'dddd, MMMM Do YYYY, h:mm:ss a'
    };
    function GUIDtoString(entry, raw, callback) {
        if (raw.hasOwnProperty('objectGUID')) {
            entry.objectGUID = guidParser.unparse(raw.objectGUID);
        }
        callback(entry);
    }
})(ProgramConfig = exports.ProgramConfig || (exports.ProgramConfig = {}));
//# sourceMappingURL=program-config.js.map
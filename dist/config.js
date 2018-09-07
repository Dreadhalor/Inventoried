let guidParser = require('./guid-parse');
let info = {
    user: 'scott.hetrick@la-archdiocese.org',
    password: 'abc#123',
    serverHost: 'localhost',
    serverInstance: 'SQLEXPRESS',
    database: 'Inventoried'
};
module.exports = {
    activedirectory2: {
        url: 'ldap://la-archdiocese.org',
        baseDN: 'dc=la-archdiocese,dc=org',
        username: info.user,
        password: info.password,
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
        user: info.user,
        password: info.password,
        server: info.serverHost,
        database: info.database,
        options: {
            instanceName: info.serverInstance,
            trustedConnection: true
        }
    },
    windowsauth: {
        ldap: {
            url: 'ldap://la-archdiocese.org/"DC=la-archdiocese,DC=org',
            base: 'DC=la-archdiocese,DC=org',
            bindDN: info.user,
            bindCredentials: info.password
        },
        integrated: false,
        usernameField: 'username',
        passwordField: 'password'
    },
    secret: 'secretOrPrivateKey',
    dateFormat: 'MMMM Do YYYY'
};
function GUIDtoString(entry, raw, callback) {
    if (raw.hasOwnProperty('objectGUID')) {
        entry.objectGUID = guidParser.unparse(raw.objectGUID);
    }
    callback(entry);
}
//# sourceMappingURL=config.js.map
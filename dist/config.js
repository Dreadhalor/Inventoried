let info = {
    user: 'scott.hetrick@la-archdiocese.org',
    password: 'abc#123'
};
module.exports = {
    activedirectory2: {
        url: 'ldap://la-archdiocese.org',
        baseDN: 'dc=la-archdiocese,dc=org',
        username: info.user,
        password: info.password,
        entryParser: formatGUIDParser,
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
        server: 'localhost',
        database: 'test',
        options: {
            instanceName: 'SQLEXPRESS',
            trustedConnection: true
        }
    }
};
function formatGUIDParser(entry, raw, callback) {
    if (raw.hasOwnProperty('objectGUID')) {
        let guidRaw = raw.objectGUID;
        let parts = [
            guidRaw.slice(0, 4).reverse(),
            guidRaw.slice(4, 6).reverse(),
            guidRaw.slice(6, 8).reverse(),
            guidRaw.slice(8, 10),
            guidRaw.slice(10, 16)
        ];
        let result = parts.map(part => {
            let mapped = '';
            part.forEach(byte => {
                let padded = '00' + byte.toString(16);
                let trimmed = padded.substring(padded.length - 2);
                mapped += trimmed;
            });
            return mapped;
        });
        entry.objectGUID = result.join('-');
    }
    callback(entry);
}
//# sourceMappingURL=config.js.map
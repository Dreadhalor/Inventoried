let info = {
  user: 'scott.hetrick@la-archdiocese.org',
  password: 'abc#123',
  serverHost: 'localhost',
  serverInstance: 'SQLEXPRESS',
  database: 'test'
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
    user: info.user,
    password: info.password,
    server: info.serverHost,
    database: info.database,
    options: {
      instanceName: info.serverInstance,
      trustedConnection: true
    }
  }
}

function GUIDtoString(entry, raw, callback){
  if (raw.hasOwnProperty('objectGUID')){
    let guidRaw = raw.objectGUID as number[];
    let parts = [
      guidRaw.slice(0,4).reverse(),
      guidRaw.slice(4,6).reverse(),
      guidRaw.slice(6,8).reverse(),
      guidRaw.slice(8,10),
      guidRaw.slice(10,16)
    ];
    let result = parts.map(part => {
      let mapped = '';
      part.forEach(byte => {
        let padded = '00' + byte.toString(16);
        let trimmed = padded.substring(padded.length - 2);
        mapped += trimmed;
      });
      return mapped;
    })
    entry.objectGUID = result.join('-');
  }
  callback(entry);
}
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';

const sql = require('mssql')
const WindowsStrategy = require('passport-windowsauth');
const ActiveDirectory = require('activedirectory2');
const config = {
  url: 'ldap://la-archdiocese.org',
  baseDN: 'dc=la-archdiocese,dc=org',
  username: 'scott.hetrick@la-archdiocese.org',
  password: 'abc#123',
  entryParser: formatGUIDParser,
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
}
const router = express.Router();
const ad = new ActiveDirectory(config);

const port = 5000;
const app = express();

//CORS middleware
app.use(cors());
//body-parse middleware
app.use(bodyParser.json());
//passport middleware
app.use(passport.initialize());

//initialize routes
/*const settings = require('./routes/settings');
app.use('/settings', settings);
const assets = require('./routes/assets');
app.use('/assets', assets);
const users = require('./routes/users');
app.use('/users', users);*/

//set client file
/*app.use(express.static(path.join(__dirname, '/client/angular-prod')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/angular-prod/index.html'));
});*/

passport.use(new WindowsStrategy({
    ldap: {
      url:             'ldap://la-archdiocese.org/"DC=la-archdiocese,DC=org',
      base:            'DC=la-archdiocese,DC=org',
      bindDN:          'scott.hetrick@la-archdiocese.org',
      bindCredentials: 'abc#123'
    },
    integrated: false,
    usernameField: 'username',
    passwordField: 'password'
  },
  (user: any, done: any) => {
    if (user) {
      return done(null, user);
    } else return done(null, false);
  }
));


app.post('/login',
  passport.authenticate('WindowsAuthentication', {session: false}),
  (req, res) => { res.json({user: req.user}); }
);

app.post('/login2', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  
  /*ad.authenticate(username, password, function(err, auth) {
    if (err) {
      res.send('ERROR: '+ JSON.stringify(err));
      return;
    }
    return res.json({authorized: auth});
  });*/
  // Find user by a sAMAccountName
  ad.findUser(username, (err, user) => {
    if (err) return res.send('ERROR: ' +JSON.stringify(err));
    if (!user) return res.send('User: ' + username + ' not found.');
    res.json(formatLDAPData(user));
  });
});

app.post('/test', async (req, res) => {
  let value = '3';
  try {
      //const pool = await sql.connect('Server=localhost\\SQLEXPRESS;Database=Vega;Trusted_Connection=True;');
      const pool = new sql.ConnectionPool({
        user: 'scott.hetrick@la-archdiocese.org',
        password: 'abc#123',
        server: 'localhost\\SQLEXPRESS',
        database: 'master',
        options: {
          encrypt: false
        }
      });
      pool.connect((err: any) => {
        return res.send(err);
      })
      return res.send(pool);
      /*const result = await sql.query`select * from mytable where id = ${value}`
      res.send(result);*/
  } catch (err) {
    res.send(err);
      // ... error checks
  }
});

app.post('/test2', async (req, res) => {

  var query = 'CN=*Manager*';

  ad.findGroups(query, (err: any, groups: any) => {
    if (err) {
      return  res.send('ERROR: ' + JSON.stringify(err));
    }

    if ((! groups) || (groups.length == 0)) res.send('No groups found.');
    else {
      res.json(groups);
    }
  });
});


app.get('/getAllUsers', async (req, res) => {
  ad.findUsers('',(err, users) => {
    if (err) return res.send('ERROR: ' + JSON.stringify(err));
    if ((!users) || (users.length == 0)) return res.send('No users found.');
    return res.json(users.map(user => formatLDAPData(user)));
    //return res.json(users);
  });
});


app.get('*', (req: any, res: any) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

function formatLDAPData(data: any){
  var result = {
    id: data.objectGUID,
    title: '', // 1
    location_id: formatForEmptyString(data.departmentnumber), // 2
    job_title: formatForEmptyString(data.title),// 3
    first_name: formatForEmptyString(data.givenName),// 4
    middle_name: formatForEmptyString(data.initials),// 5
    last_name: formatForEmptyString(data.sn),// 6
    user_name: formatForEmptyString(data.sAMAccountName),// 7
    //domain: 'la-archdiocese.org',// 8
    dep_name: formatForEmptyString(data.department),// 9
    manager_name: formatManagerName(data.manager),// 10
    full_name: formatForEmptyString(data.cn),// 11
    phone: formatForEmptyString(data.telephonenumber),// 12
    directreports: formatForEmptyNum(data.directreports), //14
    email: formatForEmptyString(data.mail),
    distinguished_name: formatForEmptyString(data.distinguishedName)
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

function formatGUIDParser(entry, raw, callback){
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
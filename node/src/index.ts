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
  attributes: {
    user: [
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
  (req: any, res: any) => { res.json({user: req.user}); }
);

app.post('/login2', (req: any, res: any) => {
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
  ad.findUser(username, (err: any, user: any) => {
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
      return  res.send('ERROR: ' +JSON.stringify(err));
    }

    if ((! groups) || (groups.length == 0)) res.send('No groups found.');
    else {
      res.json(groups);
    }
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
    title: '', // 1
    location_id: formatForEmptyString(data.departmentnumber), // 2
    job_title: formatForEmptyString(data.title),// 3
    first_name: formatForEmptyString(data.givenName),// 4
    middle_name: formatForEmptyString(data.initials),// 5
    last_name: formatForEmptyString(data.sn),// 6
    user_name: formatForEmptyString(data.sAMAccountName),// 7
    domain: 'la-archdiocese.org',// 8
    dep_name: formatForEmptyString(data.department),// 9
    manager_name: formatManagerName(data.manager),// 10
    full_name: formatForEmptyString(data.cn),// 11
    phone: formatForEmptyString(data.telephonenumber),// 12
    ismanager: formatIsManager(data.distinguishedName),//13
    directreports: formatForEmptyNum(data.directreports), //14
    email: formatForEmptyString(data.mail),
    distinguished_name: formatForEmptyString(data.distinguishedName)
  };
  return result;
}

function formatForEmptyString(value: any): string{
  return (value) ? value : '';
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
async function formatIsManager(distinguishedName: string){
  var query = 'manager=' + distinguishedName;

  await ad.findGroups(query, (err: any, groups: any) => {
    if (err) return 'ERROR: ' + JSON.stringify(err);
    if ((!groups) || (groups.length == 0)) return 'No groups found.';
    else {
      console.log(groups);
      return groups;
    }
  });
}
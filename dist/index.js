"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const config = require('./config');
const db = require('./models/classes/db');
db.connect(config.mssql);
const WindowsStrategy = require('passport-windowsauth');
const port = 5000;
const app = express();
//CORS middleware
app.use(cors());
//body-parse middleware
app.use(bodyParser.json());
//passport middleware
app.use(passport.initialize());
//initialize routes
const settings = require('./routes/settings');
app.use('/settings', settings);
const assets = require('./routes/assets');
app.use('/assets', assets);
const users = require('./routes/users');
app.use('/users', users.router);
const assignments = require('./routes/assignments');
app.use('/assignments', assignments);
//set client file
/*app.use(express.static(path.join(__dirname, '/client/angular-prod')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/angular-prod/index.html'));
});*/
passport.use(new WindowsStrategy({
    ldap: {
        url: 'ldap://la-archdiocese.org/"DC=la-archdiocese,DC=org',
        base: 'DC=la-archdiocese,DC=org',
        bindDN: 'scott.hetrick@la-archdiocese.org',
        bindCredentials: 'abc#123'
    },
    integrated: false,
    usernameField: 'username',
    passwordField: 'password'
}, (user, done) => {
    if (user) {
        return done(null, user);
    }
    else
        return done(null, false);
}));
/*app.post('/login',
  passport.authenticate('WindowsAuthentication', {session: false}),
  (req, res) => { res.json({user: req.user}); }
);

app.post('/login2', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  
  *ad.authenticate(username, password, function(err, auth) {
    if (err) {
      res.send('ERROR: '+ JSON.stringify(err));
      return;
    }
    return res.json({authorized: auth});
  });*
  // Find user by a sAMAccountName
  ad.findUser(username, (err, user) => {
    if (err) return res.send('ERROR: ' +JSON.stringify(err));
    if (!user) return res.send('User: ' + username + ' not found.');
    res.json(formatLDAPData(user));
  });
});*/
/*app.post('/test2', async (req, res) => {

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
});*/
app.get('*', (req, res) => {
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//# sourceMappingURL=index.js.map
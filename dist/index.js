"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const sql = require('mssql');
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
};
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
app.post('/login', passport.authenticate('WindowsAuthentication', { session: false }), (req, res) => { res.json({ user: req.user }); });
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
        if (err)
            return res.send('ERROR: ' + JSON.stringify(err));
        if (!user)
            return res.send('User: ' + username + ' not found.');
        res.json(formatLDAPData(user));
    });
});
app.post('/test', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        pool.connect((err) => {
            return res.send(err);
        });
        return res.send(pool);
        /*const result = await sql.query`select * from mytable where id = ${value}`
        res.send(result);*/
    }
    catch (err) {
        res.send(err);
        // ... error checks
    }
}));
app.post('/test2', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var query = 'CN=*Manager*';
    ad.findGroups(query, (err, groups) => {
        if (err) {
            return res.send('ERROR: ' + JSON.stringify(err));
        }
        if ((!groups) || (groups.length == 0))
            res.send('No groups found.');
        else {
            res.json(groups);
        }
    });
}));
app.get('/getAllUsers', (req, res) => __awaiter(this, void 0, void 0, function* () {
    ad.findUsers('', (err, users) => {
        if (err)
            return res.send('ERROR: ' + JSON.stringify(err));
        if ((!users) || (users.length == 0))
            return res.send('No users found.');
        return res.json(users.map(user => formatLDAPData(user)));
        //return res.json(users);
    });
}));
app.get('*', (req, res) => {
    res.send('hello');
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
function formatLDAPData(data) {
    var result = {
        id: data.objectGUID,
        title: '',
        location_id: formatForEmptyString(data.departmentnumber),
        job_title: formatForEmptyString(data.title),
        first_name: formatForEmptyString(data.givenName),
        middle_name: formatForEmptyString(data.initials),
        last_name: formatForEmptyString(data.sn),
        user_name: formatForEmptyString(data.sAMAccountName),
        //domain: 'la-archdiocese.org',// 8
        dep_name: formatForEmptyString(data.department),
        manager_name: formatManagerName(data.manager),
        full_name: formatForEmptyString(data.cn),
        phone: formatForEmptyString(data.telephonenumber),
        directreports: formatForEmptyNum(data.directreports),
        email: formatForEmptyString(data.mail),
        distinguished_name: formatForEmptyString(data.distinguishedName)
    };
    return result;
}
function formatForEmptyString(value) {
    return (value) ? value.trim() : '';
}
function formatForEmptyNum(value) {
    return (value) ? value.length : 0;
}
function formatManagerName(manager) {
    if (manager && manager.length > 0) {
        return manager.substring(manager.indexOf('=') + 1, manager.indexOf(','));
    }
    return '';
}
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
//# sourceMappingURL=index.js.map
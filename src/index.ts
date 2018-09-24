import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as fse from 'fs-extra';

const diff = require('deep-diff');
const config = require('../config.json');
const dbConfig = require('./server-config');
const dbClient = require('@dreadhalor/sql-client');
dbClient.connect(dbConfig.mssql)
  .then(connected => console.log('Successfully connected to SQL server.'))
  .catch(exception => console.log(
    `SQL server connection error -> ${exception}`
  ));

//create client config.json
let srcpath = path.resolve(__dirname, '../config.json');
let destdirdev = path.resolve(__dirname,'../angular/src/assets');
let destpathdev = `${destdirdev}/config.json`;
let destpathprod = path.resolve(__dirname,'../dist/client/assets/config.json');
let srcjson, destjson, destobj;
fse.readJson(destpathdev)
  .then(exists => destjson = exists)
  .catch(notExists => destjson = {})
  .then(objcreated => fse.readJson(srcpath))
  .then(exists => {
    srcjson = exists;
    destobj = srcjson.client;
    let keys = Object.keys(srcjson.shared);
    keys.forEach(key => destobj[key] = srcjson.shared[key]);
    let differences = diff(destobj, destjson);
    if (differences) return fse.writeJson(destpathprod, destobj, { spaces: 2 })
  })
  .then(prodfinished => fse.pathExists(destdirdev))
  .then(devExists => {
    if (devExists) fse.readJson(destpathdev)
    .then(exists => destjson = exists)
    .catch(notExists => destjson = {})
    .then(objcreated => {
      let differences = diff(destobj, destjson);
      if (differences) return fse.writeJson(destpathdev, destobj, { spaces: 2 })
    })
  })
  .catch(error => console.log(error));

//define port & create express app
const port = process.env.PORT || 5000;
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
app.use('/assets', assets.router);
const users = require('./routes/users');
app.use('/users', users.router);
const assignments = require('./routes/assignments');
app.use('/assignments', assignments);
const history = require('./routes/history');
app.use('/history', history.router);

//set client file
app.use(express.static(path.join(__dirname, '/client')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.config = config;
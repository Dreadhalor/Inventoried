import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';

const fse = require('fs-extra');
const dbConfig = require('./program-config');
const config = require('./config');
const dbClient = require('@dreadhalor/sql-client');
dbClient.connect(dbConfig.mssql)
  .then(connected => console.log('Successfully connected to SQL server.'))
  .catch(exception => console.log(
    `SQL server connection error -> ${exception}`
  ));

const port = config.serverPort;
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

//app.get('*', (req, res) => {});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports.config = config;

//ngrok.io token: Z45rb28xmBXrrGc5komJ_6Z36ekSeUjBEQ8rZHvAn5
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const config = require('./config');
const dbClient = require('./db/db-client');
dbClient.connect(config.mssql)
    .then(connected => console.log('Successfully connected to SQL server.'))
    .catch(exception => console.log(`SQL server connection error -> ${exception}`));
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
app.use('/assets', assets.router);
const users = require('./routes/users');
app.use('/users', users.router);
const assignments = require('./routes/assignments');
app.use('/assignments', assignments);
//set client file
/*app.use(express.static(path.join(__dirname, '/client/angular-prod')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/angular-prod/index.html'));
});*/
app.get('*', (req, res) => {
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
//ngrok.io token: Z45rb28xmBXrrGc5komJ_6Z36ekSeUjBEQ8rZHvAn5
//# sourceMappingURL=index.js.map
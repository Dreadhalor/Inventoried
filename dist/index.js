"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var config = require('./config');
var dbClient = require('./db/db-client');
dbClient.connect(config.mssql)
    .then(function (connected) { return console.log('Successfully connected to SQL server.'); })
    .catch(function (exception) { return console.log("SQL server connection error -> " + exception); });
var port = 5000;
var app = express();
//CORS middleware
app.use(cors());
//body-parse middleware
app.use(bodyParser.json());
//passport middleware
app.use(passport.initialize());
//initialize routes
var settings = require('./routes/settings');
app.use('/settings', settings);
var assets = require('./routes/assets');
app.use('/assets', assets.router);
var users = require('./routes/users');
app.use('/users', users.router);
var assignments = require('./routes/assignments');
app.use('/assignments', assignments);
var history = require('./routes/history');
app.use('/history', history.router);
//set client file
/*app.use(express.static(path.join(__dirname, '/client/angular-prod')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/angular-prod/index.html'));
});*/
app.get('*', function (req, res) { });
app.listen(port, function () {
    console.log("Server started on port " + port);
});
//ngrok.io token: Z45rb28xmBXrrGc5komJ_6Z36ekSeUjBEQ8rZHvAn5
//# sourceMappingURL=index.js.map
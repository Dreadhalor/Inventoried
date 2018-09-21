"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var jsonfile = require('jsonfile');
var diff = require('deep-diff');
var config = require('../config.json');
var dbConfig = require('./server-config');
var dbClient = require('@dreadhalor/sql-client');
dbClient.connect(dbConfig.mssql)
    .then(function (connected) { return console.log('Successfully connected to SQL server.'); })
    .catch(function (exception) { return console.log("SQL server connection error -> " + exception); });
//create client config.json
var srcpath = path.resolve(__dirname, '../config.json');
var destpath = path.resolve(__dirname, '../angular/src/assets/config.json');
var destpathprod = path.resolve(__dirname, '../dist/client/assets/config.json');
var srcobj, destobj;
jsonfile.readFile(destpath)
    .then(function (exists) { return destobj = exists; })
    .catch(function (notExists) { return destobj = {}; })
    .then(function (objcreated) { return jsonfile.readFile(srcpath); })
    .then(function (exists) {
    srcobj = exists;
    var clientobj = srcobj.client;
    var keys = Object.keys(srcobj.shared);
    keys.forEach(function (key) { return clientobj[key] = srcobj.shared[key]; });
    var differences = diff(clientobj, destobj);
    if (differences)
        return jsonfile.writeFile(destpath, clientobj, { spaces: 2 });
})
    .catch(function (error) { return console.log(error); });
//define port & create express app
var port = process.env.PORT || 5000;
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
app.use(express.static(path.join(__dirname, '/client')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});
app.listen(port, function () {
    console.log("Server started on port " + port);
});
module.exports.config = config;
//# sourceMappingURL=index.js.map
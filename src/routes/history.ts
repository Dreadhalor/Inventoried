const express = require('express');
const router = express.Router();
const config = require('../config');

import * as passport from 'passport';
const Assets = require('./assets');
const assetEdits = Assets.edits.asObservable().subscribe(
  next => console.log(next)
)

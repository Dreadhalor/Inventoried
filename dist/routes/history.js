"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const config = require('../config');
const Assets = require('./assets');
const assetEdits = Assets.edits.asObservable().subscribe(next => console.log(next));
//# sourceMappingURL=history.js.map
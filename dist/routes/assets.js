"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const config = require('../config');
router.post('/add_asset', (req, res) => {
    let asset = req.body.asset;
    let fields = Object.keys(asset);
    console.log(fields);
    res.json(asset);
});
module.exports = router;
function isDurable(asset) {
    return typeof asset.id === "number"
        && typeof asset.name === "string"
        && typeof asset.foo === "string"
        && typeof asset.bar === "string";
}
//# sourceMappingURL=assets.js.map
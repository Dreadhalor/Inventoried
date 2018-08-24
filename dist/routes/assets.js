"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consumable_1 = require("./../models/classes/consumable");
const durable_1 = require("../models/classes/durable");
const express = require('express');
const router = express.Router();
const dbClient = require('../models/classes/db-client');
router.post('/add_asset', (req, res) => {
    let asset = req.body.asset;
    if (asset) {
        let type = typeCheck(asset);
        if (type == 'durable') {
            //save durable
            dbClient.saveDurable(asset).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
        if (type == 'consumable') {
            //save consumable
            dbClient.saveConsumable(asset).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
    }
});
router.post('/update_asset', (req, res) => {
    let asset = req.body.asset;
    if (asset) {
        let type = typeCheck(asset);
        if (type == 'durable') {
            //update durable
            dbClient.updateDurable(asset).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
        if (type == 'consumable') {
            //update consumable
            dbClient.updateConsumable(asset).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
    }
});
router.post('/delete_asset', (req, res) => {
    let asset = req.body.asset;
    if (asset) {
        let type = typeCheck(asset);
        if (type == 'durable') {
            //delete durable
            dbClient.deleteDurable(asset.id).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
        if (type == 'consumable') {
            //delete consumable
            dbClient.deleteConsumable(asset.id).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
    }
});
router.get('/get_durables', (req, res) => {
    dbClient.getDurables().then(resolved => {
        let result = resolved.recordset;
        if (result)
            res.json(result);
        else
            res.json([]);
    }, rejected => res.json(rejected)).catch(exception => res.json(exception));
});
router.get('/get_consumables', (req, res) => {
    dbClient.getConsumables().then(resolved => {
        let result = resolved.recordset;
        if (result)
            res.json(result);
        else
            res.json([]);
    }, rejected => res.json(rejected)).catch(exception => res.json(exception));
});
module.exports = router;
function typeCheck(asset) {
    if (is(asset, durable_1.Durable.sample()))
        return 'durable';
    if (is(asset, consumable_1.Consumable.sample()))
        return 'consumable';
    return '';
}
function is(o, sample, strict = true, recursive = true) {
    if (o == null)
        return false;
    let s = sample;
    // If we have primitives we check that they are of the same type and that type is not object 
    if (typeof s === typeof o && typeof o != "object")
        return true;
    //If we have an array, then each of the items in the o array must be of the same type as the item in the sample array
    if (o instanceof Array) {
        // If the sample was not an arry then we return false;
        if (!(s instanceof Array))
            return false;
        let oneSample = s[0];
        let e;
        for (e of o) {
            if (!is(e, oneSample, strict, recursive))
                return false;
        }
    }
    else {
        // We check if all the properties of sample are present on o
        for (let key of Object.getOwnPropertyNames(sample)) {
            if (typeof o[key] !== typeof s[key])
                return false;
            if (recursive && typeof s[key] == "object" && !is(o[key], s[key], strict, recursive))
                return false;
        }
        // We check that o does not have any extra prperties to sample
        if (strict) {
            for (let key of Object.getOwnPropertyNames(o)) {
                if (s[key] == null)
                    return false;
            }
        }
    }
    return true;
}
//# sourceMappingURL=assets.js.map
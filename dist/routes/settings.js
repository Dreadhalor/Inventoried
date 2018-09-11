"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const dbClient = require('../db/db-client');
router.post('/set_settings', (req, res) => {
    let settings = req.body.settings;
    if (settings) {
        let durablesCategories = settings.durablesCategories;
        let consumablesCategories = settings.consumablesCategories;
        let manufacturers = settings.manufacturers;
        let tags = settings.tags;
        let promises = [];
        if (durablesCategories)
            promises.push(dbClient.setDurablesCategories(durablesCategories));
        if (consumablesCategories)
            promises.push(dbClient.setConsumablesCategories(consumablesCategories));
        if (manufacturers)
            promises.push(dbClient.setManufacturers(manufacturers));
        if (tags)
            promises.push(dbClient.setTags(tags));
        if (promises.length > 0) {
            Promise.all(promises).then(resolved => res.json(resolved), rejected => res.json(rejected)).catch(exception => res.json(exception));
        }
        else
            res.send('eh');
    }
    else
        res.send('eh');
});
router.get('/get_settings', (req, res) => {
    let durablesCategories = dbClient.getDurablesCategories();
    let consumablesCategories = dbClient.getConsumablesCategories();
    let manufacturers = dbClient.getManufacturers();
    let tags = dbClient.getTags();
    Promise.all([
        durablesCategories,
        consumablesCategories,
        manufacturers,
        tags
    ]).then(resolve => {
        res.json({
            durablesCategories: (resolve[0].recordset) ? (resolve[0].recordset) : [],
            consumablesCategories: (resolve[1].recordset) ? (resolve[1].recordset) : [],
            manufacturers: (resolve[2].recordset) ? (resolve[2].recordset) : [],
            tags: (resolve[3].recordset) ? (resolve[3].recordset) : []
        });
    }, reject => res.json(reject)).catch(exception => res.json(exception));
});
module.exports = router;
//# sourceMappingURL=settings.js.map
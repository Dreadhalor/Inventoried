"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const dbClient = require('../db/db-client');
const users = require('./users');
const DurablesCategories = require('../models/tables/DurablesCategories');
const ConsumablesCategories = require('../models/tables/ConsumablesCategories');
const Manufacturers = require('../models/tables/Manufacturers');
const Tags = require('../models/tables/Tags');
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
router.post('/set_durables_categories', (req, res) => {
    return merge(DurablesCategories, req, res);
});
router.post('/set_consumables_categories', (req, res) => {
    return merge(ConsumablesCategories, req, res);
});
router.post('/set_manufacturers', (req, res) => {
    return merge(Manufacturers, req, res);
});
router.post('/set_tags', (req, res) => {
    return merge(Tags, req, res);
});
const merge = (table, req, res) => {
    let authorization = req.headers.authorization;
    return users.checkAdminAuthorization(authorization)
        .catch(exception => res.json('Unauthorized.'))
        .then(admin => {
        let toSave = req.body.to_save;
        let toDelete = req.body.to_delete;
        return table.merge({
            toSave: toSave,
            toDelete: toDelete
        }, admin.result);
    })
        .then(success => res.json(success))
        .catch(exception => res.json(exception));
};
module.exports = router;
//# sourceMappingURL=settings.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var dbClient = require('../db/db-client');
var users = require('./users');
var DurablesCategories = require('../models/tables/DurablesCategories');
var ConsumablesCategories = require('../models/tables/ConsumablesCategories');
var Manufacturers = require('../models/tables/Manufacturers');
var Tags = require('../models/tables/Tags');
router.get('/get_settings', function (req, res) {
    var durablesCategories = dbClient.getDurablesCategories();
    var consumablesCategories = dbClient.getConsumablesCategories();
    var manufacturers = dbClient.getManufacturers();
    var tags = dbClient.getTags();
    Promise.all([
        durablesCategories,
        consumablesCategories,
        manufacturers,
        tags
    ]).then(function (resolve) {
        res.json({
            durablesCategories: (resolve[0].recordset) ? (resolve[0].recordset) : [],
            consumablesCategories: (resolve[1].recordset) ? (resolve[1].recordset) : [],
            manufacturers: (resolve[2].recordset) ? (resolve[2].recordset) : [],
            tags: (resolve[3].recordset) ? (resolve[3].recordset) : []
        });
    }, function (reject) { return res.json(reject); }).catch(function (exception) { return res.json(exception); });
});
router.post('/set_durables_categories', function (req, res) {
    return merge(DurablesCategories, req, res);
});
router.post('/set_consumables_categories', function (req, res) {
    return merge(ConsumablesCategories, req, res);
});
router.post('/set_manufacturers', function (req, res) {
    return merge(Manufacturers, req, res);
});
router.post('/set_tags', function (req, res) {
    return merge(Tags, req, res);
});
var merge = function (table, req, res) {
    var authorization = req.headers.authorization;
    return users.checkAdminAuthorization(authorization)
        .catch(function (exception) { return res.json('Unauthorized.'); })
        .then(function (admin) {
        var toSave = req.body.to_save;
        var toDelete = req.body.to_delete;
        return table.merge({
            toSave: toSave,
            toDelete: toDelete
        }, admin.result);
    })
        .then(function (success) { return res.json(success); })
        .catch(function (exception) { return res.json(exception); });
};
module.exports = router;
//# sourceMappingURL=settings.js.map
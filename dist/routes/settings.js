"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var users = require('./users');
var DurablesCategories = require('../models/tables').DurablesCategories;
var ConsumablesCategories = require('../models/tables').ConsumablesCategories;
var Manufacturers = require('../models/tables').Manufacturers;
var Tags = require('../models/tables').Tags;
router.get('/get_settings', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.json({
        error: {
            title: 'Fetch settings error',
            message: 'Unauthorized.'
        }
    }); })
        .then(function (authorized) {
        var durablesCategories = DurablesCategories.pullAll();
        var consumablesCategories = ConsumablesCategories.pullAll();
        var manufacturers = Manufacturers.pullAll();
        var tags = Tags.pullAll();
        return Promise.all([
            durablesCategories,
            consumablesCategories,
            manufacturers,
            tags
        ]);
    })
        .then(function (settings) { return res.json({
        error: null,
        result: {
            durablesCategories: settings[0],
            consumablesCategories: settings[1],
            manufacturers: settings[2],
            tags: settings[3]
        }
    }); })
        .catch(function (error) { return res.json({
        error: 'Fetch settings error',
        message: JSON.stringify(error)
    }); });
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
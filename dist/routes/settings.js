"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var auth = require('../utilities/auth');
var DurablesCategories = require('../models/tables').DurablesCategories;
var ConsumablesCategories = require('../models/tables').ConsumablesCategories;
var Manufacturers = require('../models/tables').Manufacturers;
var Tags = require('../models/tables').Tags;
router.get('/get_settings', function (req, res) {
    var authorization = req.headers.authorization;
    auth.authguard(authorization, 'admin', 'Fetch settings error')
        .broken(function (error) { return res.json(error); })
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
        .catch(function (error) { return res.json(err.formatError(error, 'Fetch settings error')); });
});
router.post('/set_durables_categories', function (req, res) {
    merge(DurablesCategories, req, res, 'Edit durables categories error');
});
router.post('/set_consumables_categories', function (req, res) {
    merge(ConsumablesCategories, req, res, 'Edit consumables categories error');
});
router.post('/set_manufacturers', function (req, res) {
    merge(Manufacturers, req, res, 'Edit manufacturers error');
});
router.post('/set_tags', function (req, res) {
    merge(Tags, req, res, 'Edit tags error');
});
var merge = function (table, req, res, title) {
    var authorization = req.headers.authorization;
    auth.authguard(authorization, 'admin', title)
        .broken(function (error) { return res.json(error); })
        .then(function (authorized) {
        var args = {
            toSave: req.body.to_save,
            toDelete: req.body.to_delete
        };
        return table.merge(args, authorized);
    })
        .then(function (merged) { return res.json({
        error: null,
        result: merged
    }); })
        .catch(function (error) { return res.json(err.formatError(error, title)); });
};
module.exports = router;
//# sourceMappingURL=settings.js.map
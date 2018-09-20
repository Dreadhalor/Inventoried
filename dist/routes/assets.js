"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var consumable_1 = require("../models/classes/consumable");
var durable_1 = require("../models/classes/durable");
var express = require('express');
var router = express.Router();
var Durables = require('../models/tables').Durables;
var Consumables = require('../models/tables').Consumables;
var users = require('./users');
var PromisePlus = require('@dreadhalor/bluebird-plus');
router.post('/save_asset', function (req, res) {
    var authorization = req.headers.authorization;
    var asset = req.body.asset;
    saveAssets(asset, authorization)
        .then(function (saved) { return res.json({
        error: null,
        result: saved
    }); })
        .catch(function (exception) { return res.json({
        error: {
            title: 'Save error',
            message: 'Unauthorized.'
        }
    }); });
});
router.post('/save_assets', function (req, res) {
    var authorization = req.headers.authorization;
    var assets = req.body.assets;
    saveAssets(assets, authorization)
        .then(function (saved) { return res.json({
        error: null,
        result: saved
    }); })
        .catch(function (exception) { return res.json({
        error: {
            title: 'Save error',
            message: 'Unauthorized.'
        }
    }); });
});
router.post('/delete_asset', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (exception) { return res.json('Unauthorized.'); })
        .then(function (admin) {
        var asset = req.body.asset;
        if (asset) {
            switch (typeCheck(asset)) {
                case 'durable':
                    Durables.deleteById(asset.id, admin.result)
                        .then(function (resolved) { return res.json(resolved); })
                        .catch(function (exception) { return res.json(exception); });
                    break;
                case 'consumable':
                    Consumables.deleteById(asset.id, admin.result)
                        .then(function (resolved) { return res.json(resolved); })
                        .catch(function (exception) { return res.json(exception); });
                    break;
                default: throw 'Object is not an asset.';
            }
        }
        else
            throw 'Not a valid asset to delete.';
    })
        .catch(function (exception) { return res.json(exception); });
});
router.get('/get_durables', function (req, res) {
    var authorization = req.headers.authorization;
    users.checkAdminAuthorization(authorization)
        .catch(function (unauthorized) { return res.json({
        error: {
            title: 'Fetch durables error',
            message: 'Unauthorized.'
        }
    }); })
        .then(function (admin) { return Durables.pullAll(); })
        .then(function (durables) { return res.json({
        error: null,
        result: durables
    }); })
        .catch(function (exception) { return res.json({
        error: {
            title: 'Fetch durables error',
            message: JSON.stringify(exception)
        }
    }); });
});
router.get('/get_consumables', function (req, res) {
    var authorization = req.headers.authorization;
    PromisePlus.convertToBreakable(users.checkAdminAuthorization(authorization))
        .break(function (unauthorized) { return res.json({
        error: {
            title: 'Fetch consumables error',
            message: 'Unauthorized.'
        }
    }); })
        .then(function (authorized) { return Consumables.pullAll(); })
        .then(function (consumables) { return res.json({
        error: null,
        result: consumables
    }); })
        .catch(function (exception) { return res.json({
        error: {
            title: 'Fetch consumables error',
            message: JSON.stringify(exception)
        }
    }); });
});
var getAsset = exports.getAsset = function (assetId) {
    return Promise.all([
        Durables.findById(assetId),
        Consumables.findById(assetId)
    ]).then(function (result) {
        if (result[0])
            return {
                type: 'durable',
                asset: result[0]
            };
        if (result[1])
            return {
                type: 'consumable',
                asset: result[1]
            };
        else
            return null;
    }).catch(function (exception) { return null; });
};
module.exports.router = router;
function typeCheck(asset) {
    if (is(asset, durable_1.Durable.sample()))
        return 'durable';
    if (is(asset, consumable_1.Consumable.sample()))
        return 'consumable';
    return '';
}
var saveAsset = exports.saveAsset = function (asset, authorization) {
    return saveAssets(asset, authorization);
    /*return users.checkAdminAuthorization(authorization)
      .catch(exception => 'User is not authorized for this.')
      .then(admin => {
        if (asset){
          switch(typeCheck(asset)){
            case 'durable': return Durables.save(asset, admin.result);
            case 'consumable': return Consumables.save(asset, admin.result);
            default: throw 'Object to save must be an asset.'
          }
        } else throw 'No asset to save.';
      })*/
};
var saveAssets = exports.saveAssets = function (assets, authorization) {
    return users.checkAdminAuthorization(authorization)
        .catch(function (exception) { return 'User is not authorized for this.'; })
        .then(function (admin) {
        if (assets) {
            if (!Array.isArray(assets)) {
                var array = [];
                array.push(assets);
                assets = array;
            }
            var durables_1 = [];
            var consumables_1 = [];
            assets.forEach(function (asset) {
                switch (typeCheck(asset)) {
                    case 'durable':
                        durables_1.push(asset);
                        break;
                    case 'consumable':
                        consumables_1.push(asset);
                        break;
                    default: throw 'All objects to save must be assets.';
                }
            });
            //CURRENTLY: if presented with durables + consumables, only saves the durables
            if (durables_1.length > 0)
                return Durables.save(durables_1, admin.result);
            if (consumables_1.length > 0)
                return Consumables.save(consumables_1, admin.result);
            return Promise.resolve({});
            //let promises = [];
            //if (durables.length > 0) promises.push(Durables.save(durables, admin.result));
            //if (consumables.length > 0) promises.push(Consumables.save(consumables, admin.result));
            //return Promise.all(promises);
        }
        else
            throw 'No asset to save.';
    });
};
var checkin = exports.checkin = function (assetId, assignmentId, agent) {
    if (assetId)
        return getAsset(assetId)
            .then(function (asset) {
            switch (asset.type) {
                case 'durable':
                    var durable = asset.asset;
                    if (durable.assignmentId == assignmentId) {
                        durable.assignmentId = '0';
                        return Durables.save(durable, agent);
                    }
                    else
                        throw "Durable " + durable.serialNumber + " does not belong to this assignment.";
                case 'consumable':
                    var consumable = asset.asset;
                    for (var i = consumable.assignmentIds.length - 1; i >= 0; i--) {
                        if (consumable.assignmentIds[i] == assignmentId)
                            consumable.assignmentIds.splice(i, 1);
                    }
                    return Consumables.save(consumable, agent);
                default: throw 'Error with asset formatting.';
            }
        });
    else
        throw 'No asset to check in.';
};
function is(o, sample, strict, recursive) {
    if (strict === void 0) { strict = true; }
    if (recursive === void 0) { recursive = true; }
    if (o == null)
        return false;
    var s = sample;
    // If we have primitives we check that they are of the same type and that type is not object 
    if (typeof s === typeof o && typeof o != "object")
        return true;
    //If we have an array, then each of the items in the o array must be of the same type as the item in the sample array
    if (o instanceof Array) {
        // If the sample was not an arry then we return false;
        if (!(s instanceof Array))
            return false;
        var oneSample = s[0];
        var e = void 0;
        for (var _i = 0, o_1 = o; _i < o_1.length; _i++) {
            e = o_1[_i];
            if (!is(e, oneSample, strict, recursive))
                return false;
        }
    }
    else {
        // We check if all the properties of sample are present on o
        for (var _a = 0, _b = Object.getOwnPropertyNames(sample); _a < _b.length; _a++) {
            var key = _b[_a];
            if (typeof o[key] !== typeof s[key])
                return false;
            if (recursive && typeof s[key] == "object" && !is(o[key], s[key], strict, recursive))
                return false;
        }
        // We check that o does not have any extra prperties to sample
        if (strict) {
            for (var _c = 0, _d = Object.getOwnPropertyNames(o); _c < _d.length; _c++) {
                var key = _d[_c];
                if (s[key] == null)
                    return false;
            }
        }
    }
    return true;
}
//# sourceMappingURL=assets.js.map
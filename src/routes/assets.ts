import { Consumable } from '../models/classes/consumable';
import { Durable } from '../models/classes/durable';

const express = require('express');
const router = express.Router();

const Durables = require('../models/tables/Durables');
const Consumables = require('../models/tables/Consumables');
const Users = require('./users');

router.post('/add_asset', (req, res) => {
  let authorization = req.headers.authorization;
  let asset = req.body.asset;
  saveAsset(asset,authorization)
    .then(saved => res.json(saved))
    .catch(exception => res.json(exception));
})
router.post('/add_assets', (req, res) => {
  let authorization = req.headers.authorization;
  let assets = req.body.assets;
  saveAssets(assets,authorization)
    .then(allSaved => res.json(allSaved))
    .catch(exception => res.json(exception));
})
router.post('/update_asset', (req, res) => {
  let authorization = req.headers.authorization;
  Users.checkAdminAuthorization(authorization)
    .then(admin => {
      let asset = req.body.asset;
      if (asset){
        switch(typeCheck(asset)){
          case 'durable':
            Durables.save(asset, admin.result)
              .then(resolved => res.json(resolved))
              .catch(exception => res.json(exception));
            break;
          case 'consumable':
            Consumables.save(asset, admin.result)
              .then(resolved => res.json(resolved))
              .catch(exception => res.json(exception));
            break;
          default: throw 'Invalid asset.'
        }
      }
    })
    .catch(exception => res.json(exception));
})
router.post('/delete_asset', (req, res) => {
  let authorization = req.headers.authorization;
  Users.checkAdminAuthorization(authorization)
    .catch(exception => res.json('Unauthorized.'))
    .then(admin => {
      let asset = req.body.asset;
      if (asset){
        switch(typeCheck(asset)){
          case 'durable':
            Durables.deleteById(asset.id, admin.result)
              .then(resolved => res.json(resolved))
              .catch(exception => res.json(exception));
            break;
          case 'consumable':
            Consumables.deleteById(asset.id, admin.result)
              .then(resolved => res.json(resolved))
              .catch(exception => res.json(exception));
            break;
          default: throw 'Object is not an asset.'
        }
      } else throw 'Not a valid asset to delete.'
    })
    .catch(exception => res.json(exception));
})

router.get('/get_durables', (req, res) => {
  let authorization = req.headers.authorization;
  Users.checkAdminAuthorization(authorization)
    .then(admin => Durables.pullAll())
    .then(durables => res.json(durables))
    .catch(exception => res.json([]));
})
router.get('/get_consumables', (req, res) => {
  let authorization = req.headers.authorization;
  Users.checkAdminAuthorization(authorization)
    .then(admin => Consumables.pullAll())
    .then(consumables => res.json(consumables))
    .catch(exception => res.json([]));
})

const getAsset = exports.getAsset = (assetId: string) => {
  return Promise.all([
    Durables.findById(assetId),
    Consumables.findById(assetId)
  ]).then(
    result => {
      if (result[0]) return {
        type: 'durable',
        asset: result[0]
      }
      if (result[1]) return {
        type: 'consumable',
        asset: result[1]
      }
      else return null;
    }
  ).catch(exception => null);
};

module.exports.router = router;

function typeCheck(asset: any){
  if (is(asset, Durable.sample())) return 'durable';
  if (is(asset, Consumable.sample())) return 'consumable';
  return '';
}
const saveAsset = exports.saveAsset = (asset, authorization) => {
  return Users.checkAdminAuthorization(authorization)
    .catch(exception => 'User is not authorized for this.')
    .then(admin => {
      if (asset){
        switch(typeCheck(asset)){
          case 'durable': return Durables.save(asset, admin.result);
          case 'consumable': return Consumables.save(asset, admin.result);
          default: throw 'Object to save must be an asset.'
        }
      } else throw 'No asset to save.';
    })
}
const saveAssets = exports.saveAssets = (assets, authorization) => {
  return Users.checkAdminAuthorization(authorization)
    .catch(exception => 'User is not authorized for this.')
    .then(admin => {
      if (assets){
        let durables = [];
        let consumables = [];
        assets.forEach(asset => {
          switch(typeCheck(asset)){
            case 'durable':
              durables.push(asset);
              break;
            case 'consumable':
              consumables.push(asset);
              break;
            default: throw 'All objects to save must be assets.'
          }
        })
        return Durables.saveBulk(durables);
      } else throw 'No asset to save.';
    })
}

function is<T>(o: any, sample:T, strict = true, recursive = true) : o is T {
  if( o == null) return false;
  let s = sample as any;
  // If we have primitives we check that they are of the same type and that type is not object 
  if(typeof s === typeof o && typeof o != "object") return true;

  //If we have an array, then each of the items in the o array must be of the same type as the item in the sample array
  if(o instanceof Array){
      // If the sample was not an arry then we return false;
      if(!(s instanceof Array)) return false;
      let oneSample = s[0];
      let e: any;
      for(e of o) {
          if(!is(e, oneSample, strict, recursive)) return false;
      }
  } else {
      // We check if all the properties of sample are present on o
      for(let key of Object.getOwnPropertyNames(sample)) {
          if(typeof o[key] !== typeof s[key]) return false;
          if(recursive && typeof s[key] == "object" && !is(o[key], s[key], strict, recursive)) return false;
      }
      // We check that o does not have any extra prperties to sample
      if(strict)  {
          for(let key of Object.getOwnPropertyNames(o)) {
              if(s[key] == null) return false;
          }
      }
  }

  return true;
}
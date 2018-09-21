import { Consumable } from '../models/classes/consumable';
import { Durable } from '../models/classes/durable';

const express = require('express');
const router = express.Router();

const Durables = require('../models/tables').Durables;
const Consumables = require('../models/tables').Consumables;
const auth = require('../utilities/auth');

router.post('/save_asset', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Save asset error')
    .broken(error => res.json(error))
    .then(agent => {
      let asset = req.body.asset;
      return saveAssets(asset, agent)
    })
    .then(saved => res.json({
      error: null,
      result: saved
    }))
    .catch(errorMessage => res.json({
      error: {
        title: 'Save asset error',
        message: errorMessage
      }
    }));
})
router.post('/save_assets', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Save assets error')
    .broken(error => res.json(error))
    .then(authorized => {
      let assets = req.body.assets;
      return saveAssets(assets, authorized)
    })
    .then(saved => res.json({
      error: null,
      result: saved
    }))
    .catch(errorMessage => res.json({
      error: {
        title: 'Save assets error',
        message: errorMessage
      }
    }));
})
router.post('/delete_asset', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Delete asset error')
    .broken(error => res.json(error))
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
  auth.authguard(authorization, 'admin', 'Fetch durables error')
    .broken(error => res.json(error))
    .then(admin => Durables.pullAll())
    .then(durables => res.json({
      error: null,
      result: durables
    }))
    .catch(exception => res.json({
      error: {
        title: 'Fetch durables error',
        message: JSON.stringify(exception)
      }
    }));
})
router.get('/get_consumables', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Fetch consumables error')
    .broken(error => res.json(error))
    .then(authorized => Consumables.pullAll())
    .then(consumables => res.json({
      error: null,
      result: consumables
    }))
    .catch(exception => res.json({
      error: {
        title: 'Fetch consumables error',
        message: JSON.stringify(exception)
      }
    }));
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
const saveAsset = exports.saveAsset = (asset, agent) => {
  return saveAssets(asset, agent);
}
const saveAssets = exports.saveAssets = (assets, agent) => {
  if (assets){
    if (!Array.isArray(assets)){
      let array = [];
      array.push(assets);
      assets = array;
    }
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
    //CURRENTLY: if presented with durables + consumables, only saves the durables
    if (durables.length > 0) return Durables.save(durables, agent);
    if (consumables.length > 0) return Consumables.save(consumables, agent);
    return Promise.resolve({});
  }
}

const checkin = exports.checkin = (assetId, assignmentId, agent) => {
  if (assetId) return getAsset(assetId)
    .then(asset => {
      switch(asset.type){
        case 'durable':
          let durable = asset.asset;
          if (durable.assignmentId == assignmentId){
            durable.assignmentId = '0';
            return Durables.save(durable, agent);
          } else throw `Durable ${durable.serialNumber} does not belong to this assignment.`;
        case 'consumable':
          let consumable = asset.asset;
          for (let i = consumable.assignmentIds.length - 1; i >= 0; i--){
            if (consumable.assignmentIds[i] == assignmentId)
              consumable.assignmentIds.splice(i,1);
          }
          return Consumables.save(consumable, agent);
        default: throw 'Error with asset formatting.';
      }
    })
  else throw 'No asset to check in.';
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
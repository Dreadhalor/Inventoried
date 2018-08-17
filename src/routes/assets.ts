import { Consumable } from './../models/classes/consumable';
import { Durable } from "../models/classes/durable";

const express = require('express');
const router = express.Router();
const db = require('../models/classes/db');

router.post('/add_asset', (req,res) => {
  let asset = req.body.asset;
  if (asset){
    let type = typeCheck(asset);
    if (type == 'durable'){
      db.saveDurable(asset).then(
        resolved => res.json(resolved),
        rejected => res.json(rejected)
      ).catch(exception => {console.log('bruh'); res.json(exception)});
    }
    if (type == 'consumable'){
      //save consumable
    }
  }
})

module.exports = router;

function typeCheck(asset: any){
  if (is(asset,Durable.sample())) return 'durable';
  if (is(asset,Consumable.sample())) return 'consumable';
  return '';
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
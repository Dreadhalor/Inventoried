import * as express from 'express';
const router = express.Router();

const auth = require('../utilities/auth');
const err = require('../utilities/error');

const DurablesCategories = require('../models/tables').DurablesCategories;
const ConsumablesCategories = require('../models/tables').ConsumablesCategories;
const Manufacturers = require('../models/tables').Manufacturers;
const Tags = require('../models/tables').Tags;

const db = require('@dreadhalor/sql-client').db;

router.get('/get_settings', (req, res) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', 'Fetch settings error')
    .broken(error => res.json(error))
    .then(authorized => {
      let durablesCategories = DurablesCategories.pullAll();
      let consumablesCategories = ConsumablesCategories.pullAll();
      let manufacturers = Manufacturers.pullAll();
      let tags = Tags.pullAll();
      return Promise.all([
        durablesCategories,
        consumablesCategories,
        manufacturers,
        tags
      ])
    })
    .then(settings => res.json({
      error: null,
      result: {
        durablesCategories: settings[0],
        consumablesCategories: settings[1],
        manufacturers: settings[2],
        tags: settings[3]
      }
    }))
    .catch(error => res.json(err.formatError(error, 'Fetch settings error')));
})

router.post('/set_durables_categories', (req, res) => {
  merge(DurablesCategories, req, res, 'Edit durables categories error');
})
router.post('/set_consumables_categories', (req, res) => {
  merge(ConsumablesCategories, req, res, 'Edit consumables categories error');
})
router.post('/set_manufacturers', (req, res) => {
  merge(Manufacturers, req, res, 'Edit manufacturers error');
})
router.post('/set_tags', (req, res) => {
  merge(Tags, req, res, 'Edit tags error');
})

const merge = (table, req, res, title) => {
  let authorization = req.headers.authorization;
  auth.authguard(authorization, 'admin', title)
    .broken(error => res.json(error))
    .then(authorized => {
      let toSave = table.save(req.body.to_save, {standalone: false});
      let toDelete = table.delete(req.body.to_delete, {standalone: false});
      let promises = [];
      if (toSave) promises.push(table.save(req.body.to_save, {standalone: false}));
      if (toDelete) promises.push(table.delete(req.body.to_delete, {standalone: false}));
      return db.all(promises);
    })
    .then(merged => res.json({
      error: null,
      result: merged
    }))
    .catch(error => {
      console.log(error);
      res.json(err.formatError(error, title))
    });
}

module.exports = router;
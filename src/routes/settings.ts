import * as express from 'express';
const router = express.Router();

const dbClient = require('../db/db-client');
const users = require('./users');

const DurablesCategories = require('../models/tables/DurablesCategories');
const ConsumablesCategories = require('../models/tables/ConsumablesCategories');
const Manufacturers = require('../models/tables/Manufacturers');
const Tags = require('../models/tables/Tags');

router.get('/get_settings', (req, res) => {
  let durablesCategories = DurablesCategories.pullAll();
  let consumablesCategories = ConsumablesCategories.pullAll();
  let manufacturers = Manufacturers.pullAll();
  let tags = Tags.pullAll();
  Promise.all([
    durablesCategories,
    consumablesCategories,
    manufacturers,
    tags
  ])
  .then(settings => res.json({
    durablesCategories: settings[0],
    consumablesCategories: settings[1],
    manufacturers: settings[2],
    tags: settings[3]
  }))
  .catch(exception => res.json(exception));
})

router.post('/set_durables_categories', (req, res) => {
  return merge(DurablesCategories, req, res);
})
router.post('/set_consumables_categories', (req, res) => {
  return merge(ConsumablesCategories, req, res);
})
router.post('/set_manufacturers', (req, res) => {
  return merge(Manufacturers, req, res);
})
router.post('/set_tags', (req, res) => {
  return merge(Tags, req, res);
})

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
      },
      admin.result);
    })
    .then(success => res.json(success))
    .catch(exception => res.json(exception));
}

module.exports = router;
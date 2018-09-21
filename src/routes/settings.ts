import * as express from 'express';
const router = express.Router();

const auth = require('../utilities/auth');

const DurablesCategories = require('../models/tables').DurablesCategories;
const ConsumablesCategories = require('../models/tables').ConsumablesCategories;
const Manufacturers = require('../models/tables').Manufacturers;
const Tags = require('../models/tables').Tags;

router.get('/get_settings', (req, res) => {
  let authorization = req.headers.authorization;
  auth.checkAdminAuthorization(authorization, 'Fetch settings error')
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
    .catch(error => res.json({
      error: 'Fetch settings error',
      message: JSON.stringify(error)
    }))
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
  auth.checkAdminAuthorization(authorization, title)
    .broken(error => res.json(error))
    .then(authorized => {
      let args = {
        toSave: req.body.to_save,
        toDelete: req.body.to_delete
      };
      return table.merge(args, authorized);
    })
    .then(merged => res.json({
      error: null,
      result: merged
    }))
    .catch(error => {
      let errorMessage = (typeof error == 'string') ? error : JSON.stringify(error);
      res.json({
        error: {
          title: title,
          message: errorMessage
        }
      });
    })
}

module.exports = router;
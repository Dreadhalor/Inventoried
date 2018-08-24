import * as express from 'express';
const router = express.Router();

const dbClient = require('../models/classes/db-client');
const users = require('./users');

router.post('/create_assignment', (req, res) => {
  let userId = req.body.userId;
  let assetId = req.body.assetId;
  let checkoutDate = req.body.checkoutDate;
  let dueDate = req.body.dueDate;
  if (userId && assetId && checkoutDate && dueDate){
    res.json(users.getUser(userId));
  }
  else res.send('nope');
})

module.exports = router;
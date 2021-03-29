const express = require('express');
const router = express.Router();

const infoCardcontroller = require('../controllers/infoCardController');

router
  .post('/', infoCardcontroller.createCard)
  .get('/list', infoCardcontroller.totalList)
  .get('/', infoCardcontroller.detailList)
  .put('/', infoCardcontroller.modifyCard);

module.exports = router;

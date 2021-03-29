const express = require('express');
const router = express.Router();
const infoCardcontroller = require('../controllers/infoCardController');

router.get('/list', infoCardcontroller.totalList).get('/', infoCardcontroller.detailList);

module.exports = router;

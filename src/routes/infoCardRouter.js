const express = require('express');
const router = express.Router();
const controllerModule = require('../controllers/infoCardController');

router.post('/', controllerModule.createCard);

module.exports = router;

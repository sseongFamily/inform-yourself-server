const express = require('express');
const router = express.Router();
const controllerModule = require('../controllers/userController');

router.post('/signup', controllerModule.signup);

module.exports = router;

const express = require('express');
const router = express.Router();
const controllerModule = require('../controllers/userController');

router.post('/signup', controllerModule.signup).post('/login', controllerModule.login);

module.exports = router;

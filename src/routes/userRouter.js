const express = require('express');
const router = express.Router();
const controllerModule = require('../controllers/userController');

router
  .post('/signup', controllerModule.signup)
  .post('/login', controllerModule.login)
  .post('/', controllerModule.modify)
  .get('/list', controllerModule.list)
  .get('/', controllerModule.info);

module.exports = router;

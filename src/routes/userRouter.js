const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController');

routes.post('/login', userController.lgoin);

module.exports = routes;

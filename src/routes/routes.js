const express = require('express');
const routes = express.Router();

const login = require('../api/login');

routes.get('/login/:cpf/:senha',login.login);

module.exports = routes;
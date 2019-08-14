const express = require('express');
const routes = express.Router();

const login = require('../api/login');

routes.get('/login/:cpf/:senha',login.login);

routes.get('/',(req,res) => {
    return res.send('wellcome');
})

module.exports = routes;
const express = require('express');
const routes = express.Router();

const getDados = require('./api/get-dados');

routes.post('/get-dados',getDados.execute);

routes.get('/',(req,res) => {
    return res.send('wellcome');
})

module.exports = routes;
const express = require('express');
const routes = express.Router();

const getComprovante = require('./api/get-comprovante');

routes.post('/get-comprovante',getComprovante.execute);

routes.get('/',(req,res) => {
    return res.send('wellcome');
})

module.exports = routes;
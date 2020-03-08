const express = require('express');
const routes = express.Router();

const getDados = require('./api/get-dados');
const getInfoMateria = require('./api/get-info-materia');

routes.post('/get-dados', getDados.execute);
routes.get('/get-info-materia/:disciplina/:nuPerInicial', getInfoMateria.execute);
routes.get('/verifica-atualizacao', (req, res) => {
    return res.send({
        ULTIMA_ATT : 1583643981642,
        ENDERECO_ATT : 'https://ayrtonsilas.com.br/api/siac-mobile.apk'
    })
})

routes.get('/', (req, res) => {
    return res.send('wellcome');
})

module.exports = routes;
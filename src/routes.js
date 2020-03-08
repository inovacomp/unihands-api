const express = require('express');
const routes = express.Router();

const getDados = require('./api/get-dados');
const getInfoMateria = require('./api/get-info-materia');

routes.post('/get-dados', getDados.execute);
routes.get('/get-info-materia/:disciplina/:nuPerInicial', getInfoMateria.execute);
routes.get('/verifica-atualizacao', (req, res) => {
    return res.send({
        ULTIMA_ATT : 1583645205821,
        ENDERECO_ATT : 'https://ayrtonsilas.com.br/api/download-apk'
    })
})
routes.get('/download-apk', async (req, res) => {
    const file = `src/apk/siac-mobile.apk`;
    res.download(file); // Set disposition and send it.
  });

routes.get('/', (req, res) => {
    return res.send('wellcome');
})

module.exports = routes;
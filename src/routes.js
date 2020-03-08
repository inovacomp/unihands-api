const express = require('express');
const routes = express.Router();
const path = require('path');
const getDados = require('./api/get-dados');
const getInfoMateria = require('./api/get-info-materia');

routes.post('/get-dados', getDados.execute);
routes.get('/get-info-materia/:disciplina/:nuPerInicial', getInfoMateria.execute);
routes.get('/verifica-atualizacao', (req, res) => {
    return res.send({
        ULTIMA_ATT: 1583647657864,
        ENDERECO_ATT: 'https://ayrtonsilas.com.br/api/download-apk'
    })
})
routes.get('/apk',async (req,res) => {
    res.sendFile(path.join(__dirname+'/view/apk.html'));
})
routes.get('/download-apk', async (req, res) => {
    const file = `src/apk/siac-mobile.apk`;
    res.download(file);
});

routes.get('/', (req, res) => {
    return res.send('wellcome');
})

module.exports = routes;
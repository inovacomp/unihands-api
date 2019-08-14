const express = require("express");
const cors = require('cors');
const requireDir = require("require-dir");

//iniciando o app
const app = express();
//permite que envie dados para aplicação no formato json
app.use(express.json());
app.use(cors());

// requireDir('./src/api');

//rotas
app.use('/api',require('./src/routes/routes'));


app.listen(3000);

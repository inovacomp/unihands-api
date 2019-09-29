var request = require('request');

const helper = require('../helpers/helpers');

module.exports = {
    async run(html) {
        let retorno = {};
        //instancia do HTML para Objeto
        const $ = helper.instanceCheerio(html);

        retorno.MATERIAS_OBRIGATORIAS = [];

        let tabelaMaterias = $('table').find('table').eq(5);
        tabelaMaterias.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            let linhaRetorno = {};
            linhaRetorno.ID = index + 1;
            if(colunas.eq(0).text().trim() == ''){
                linhaRetorno.SEMESTRE = retorno.MATERIAS_OBRIGATORIAS[index-1].SEMESTRE;
            }
            else{
                linhaRetorno.SEMESTRE = colunas.eq(0).text().trim();
            }
            linhaRetorno.CODIGO = colunas.eq(2).text().trim();
            linhaRetorno.NOME = colunas.eq(3).text().trim();
            linhaRetorno.PRE_REQ = colunas.eq(4).text().trim();
            if(linhaRetorno.PRE_REQ != '--' && linhaRetorno.PRE_REQ != ''){
                linhaRetorno.PRE_REQ = linhaRetorno.PRE_REQ.split(',');
            }
            retorno.MATERIAS_OBRIGATORIAS.push(linhaRetorno);
        });
        retorno.MATERIAS_OBRIGATORIAS = retorno.MATERIAS_OBRIGATORIAS.filter(x => { return x.CODIGO.length > 0 });
        return retorno;
    }
}


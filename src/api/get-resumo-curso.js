var request = require('request');

const helper = require('../helpers/helpers');

module.exports = {
    async run(html) {
        let retorno = {};
        //instancia do HTML para Objeto
        const $ = helper.instanceCheerio(html);

        retorno = [];

        let tabelaResumo = $('table').find('table').eq(6);
        tabelaResumo.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
                let linhaRetorno = {};
                linhaRetorno.ID = index + 1;
                linhaRetorno.TIPO = colunas.eq(0).text().trim();
                linhaRetorno.DESC = colunas.eq(1).text().trim();
                linhaRetorno.VALOR = colunas.eq(2).text().trim();
                linhaRetorno.CREDITACAO = colunas.eq(3).text().trim();
                retorno.push(linhaRetorno);
        });

        retorno.DURACAO_MINIMA = $('body > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(4) > tbody:nth-child(2) > tr > td:nth-child(3)').text();
        retorno.DURACAO_MAXIMA = $('body > table > tbody > tr:nth-child(3) > td:nth-child(2) > table:nth-child(4) > tbody:nth-child(2) > tr > td:nth-child(4)').text();
        return retorno;
    }
}


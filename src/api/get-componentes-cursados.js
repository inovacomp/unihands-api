var request = require('request');

const helper = require('../helpers/helpers');

const resolverSiglas = (sigla) => {
    
    switch (sigla.toUpperCase()) {
        case 'NT':
            return 'Natureza';
        case 'OB':
            return 'Obrigatória';
        case 'OP':
            return 'Optativa';
        case 'AP':
            return 'Aprovado';
        case 'DI':
            return 'Dispensado';
        case 'DU':
            return 'Dispensado UFBA';
        case 'RF':
            return 'Reprovado Frequencia';
        case 'RR':
            return 'Reprovado por Nota';
        case 'TR':
            return 'Trancamento';
    }
};

module.exports = {
    async run(html) {
        let retorno = {};
        //instancia do HTML para Objeto
        const $ = helper.instanceCheerio(html);

        retorno.MATERIAS_CURSADAS = [];

        let tabelaMaterias = $('table').find('table').eq(6);
        tabelaMaterias.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            if(colunas.eq(1).text().trim() != ''){
                let linhaRetorno = {};
                linhaRetorno.ID = index + 1;
                linhaRetorno.PERIODO = colunas.eq(0).text().trim();
                linhaRetorno.CODIGO = colunas.eq(1).text().trim();
                linhaRetorno.NOME = colunas.eq(2).text().trim();
                linhaRetorno.CH = colunas.eq(3).text().trim();
                linhaRetorno.NATUREZA = colunas.eq(5).text().trim();
                linhaRetorno.NOTA = colunas.eq(6).text().trim();
                linhaRetorno.RESULTADO = resolverSiglas(colunas.eq(7).text().trim());
                retorno.MATERIAS_CURSADAS.push(linhaRetorno);
            }
        });
        
        retorno.CARGA_HORARIA_COMPLEMENTAR = [];

        let tabelaCargaHorariaComplementar = $('table').find('table').eq(7);
        tabelaCargaHorariaComplementar.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            if(colunas.eq(1).text().trim() != ''){
                let linhaRetorno = {};
                linhaRetorno.ID = index + 1;
                linhaRetorno.MODALIDADE = colunas.eq(0).text().trim();
                linhaRetorno.CH = colunas.eq(1).text().trim();
                retorno.CARGA_HORARIA_COMPLEMENTAR.push(linhaRetorno);
            }
        });

        return retorno;
    }
}


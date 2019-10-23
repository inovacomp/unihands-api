var request = require('request');
const helper = require('../helpers/helpers');

module.exports = {
    async execute(req, res) {
        var body = {
            disciplina: req.params.disciplina,
            nuPerInicial: req.params.nuPerInicial
        }

        retornar = () => res.send(retorno);

        limparText = (txt) => txt.trim().replace(/(\r\n|\n|\r)/gm, " ");

        var retorno = {};
        await request({
            url: `https://alunoweb.ufba.br/SiacWWW/ExibirEmentaPublico.do?cdDisciplina=${body.disciplina}&nuPerInicial=${body.nuPerInicial}`,
            method: "GET",
            encoding: null
        },
            async (error, response, body) => {
                const $ = helper.instanceCheerio(body);
                tabela = $('table').eq(1);
                linhas = tabela.find('tr');
                retorno.materia = limparText(linhas.eq(1).text());
                retorno.cargaHorariaTotal = limparText(linhas.eq(2).text());
                retorno.teorica = limparText(linhas.eq(4).find('td').eq(0).text());
                retorno.pratica = limparText(linhas.eq(4).find('td').eq(1).text());
                retorno.estagio = limparText(linhas.eq(4).find('td').eq(2).text());
                retorno.departamento = limparText(linhas.eq(4).find('td').eq(3).text());
                retorno.semestreVigente = limparText(linhas.eq(4).find('td').eq(4).text());
                retorno.ementa = limparText(linhas.eq(6).text());
                retorno.objetivo = limparText(linhas.eq(9).text());
                retorno.conteudo = limparText(linhas.eq(11).text());
                retorno.bibliografia = limparText(linhas.eq(13).text());
                retornar();
            }
        );


    }
}
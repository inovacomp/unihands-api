var request = require('request');

const helper = require('../helpers/helpers');

module.exports = {
    async run(html) {
        let retorno = {};

        //instancia do HTML para Objeto
        const $ = helper.instanceCheerio(html);

        //busca busca no DOM por texto na tag
        const bFilter = search => {
            return $('b').filter(function () {
                return $(this).text().trim() == search;
            }).first().closest('td').text().split(':')[1].trim();
        }

        retorno.MATRICULA = bFilter('MATRÍCULA:');
        retorno.NOME = bFilter('ALUNO(A):');
        retorno.CURSO = bFilter('CURSO:');
        retorno.CR = bFilter('CR:');

        /*INICIO sessão de materias do comprovante*/
        let tabelaMaterias = $('table').find('table').eq(5);
        retorno.MATERIAS_COMPROVANTE = [];

        let horariosAula = [];

        tabelaMaterias.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            let linhaRetorno = {};
            if (colunas.eq(8).text().trim() != '') {
                linhaRetorno.ID = index + 1;
                linhaRetorno.CODIGOMATERIA = colunas.eq(0).text().trim();
                if (linhaRetorno.CODIGOMATERIA == '') {
                    linhaRetorno.CODIGOMATERIA = retorno.MATERIAS_COMPROVANTE[index - 1].CODIGOMATERIA;
                }
                linhaRetorno.NOMEMATERIA = colunas.eq(1).text().trim();
                if (linhaRetorno.NOMEMATERIA == '') {
                    linhaRetorno.NOMEMATERIA = retorno.MATERIAS_COMPROVANTE[index - 1].NOMEMATERIA;
                }
                linhaRetorno.CH = colunas.eq(2).text().trim();
                if (linhaRetorno.CH == '') {
                    linhaRetorno.CH = retorno.MATERIAS_COMPROVANTE[index - 1].CH;
                }
                linhaRetorno.TURMA = colunas.eq(3).text().trim();
                if (linhaRetorno.TURMA == '') {
                    linhaRetorno.TURMA = retorno.MATERIAS_COMPROVANTE[index - 1].TURMA;
                }
                linhaRetorno.TURMA += '-' + colunas.eq(4).text().trim();
                linhaRetorno.DIA = colunas.eq(5).text().trim();
                linhaRetorno.HORARIO = colunas.eq(6).text().trim();
                linhaRetorno.LOCAL = colunas.eq(7).text().trim();
                linhaRetorno.DOCENTE = colunas.eq(8).text().trim();
                if (linhaRetorno.DIA != 'CMB') {
                    horariosAula.push({
                        MATERIA: linhaRetorno.CODIGOMATERIA,
                        HORARIO_INI: linhaRetorno.HORARIO.split('/')[0].trim(),
                        HORARIO_FIM: linhaRetorno.HORARIO.split('/')[1].trim(),
                        DIA: linhaRetorno.DIA
                    })
                }
                retorno.MATERIAS_COMPROVANTE.push(linhaRetorno);
            }
        });
        /*FIM*/
        
        //INICIO Monta os horários das materias
        let tabelaQuadroAulas = $('#curriculoTable');
        retorno.MATERIAS_HORARIOS = [];

        const filterHorarios = (key, dia) => {
            let retorno = '';
            horariosAula.forEach(element => {
                if (Date.parse('01/01/2000 ' + key) >= Date.parse('01/01/2000 ' + element.HORARIO_INI) && 
                    Date.parse('01/01/2000 ' + key) < Date.parse('01/01/2000 ' + element.HORARIO_FIM) && 
                    element.DIA == dia) {
                    retorno = element.MATERIA;
                    return;
                }
            });
            return retorno;
        }

        tabelaQuadroAulas.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            let linhaRetorno = [];
            
            if (index > 0) {
                linhaRetorno[0] = colunas.eq(0).text().trim();
                linhaRetorno[1] = filterHorarios(linhaRetorno[0], 'SEG');
                linhaRetorno[2] = filterHorarios(linhaRetorno[0], 'TER');
                linhaRetorno[3] = filterHorarios(linhaRetorno[0], 'QUA');
                linhaRetorno[4] = filterHorarios(linhaRetorno[0], 'QUI');
                linhaRetorno[5] = filterHorarios(linhaRetorno[0], 'SEX');
                linhaRetorno[6] = filterHorarios(linhaRetorno[0], 'SAB');
                retorno.MATERIAS_HORARIOS.push(linhaRetorno);
            }
        });
        /*FIM*/
        
        /*LOCAIS DE AULA*/
        retorno.LOCAIS_AULA = [];
        let tabelaLocaisAula = $('table').find('table').eq(6);
        tabelaLocaisAula.children('tbody').find('tr').each((index, element) => {
            let colunas = $(element).find('td');
            let linhaRetorno = {};
            if (colunas.eq(0).text().trim() != '') {
                linhaRetorno.INFO_1 = colunas.eq(0).text().trim();
                linhaRetorno.INFO_2 = colunas.eq(1).text().trim();
                linhaRetorno.INFO_3 = colunas.eq(2).text().trim();
                linhaRetorno.INFO_4 = colunas.eq(3).text().trim();
                retorno.LOCAIS_AULA.push(linhaRetorno);
            }
        });

        return retorno;
    }
}


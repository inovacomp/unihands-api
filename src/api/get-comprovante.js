var request = require('request');

const helper = require('../helpers/helpers');

const processaDados = (html) => {
    let retorno = {};
    
    //instancia do HTML para Objeto
    const $ = helper.instanceCheerio(html);
    
    //busca busca no DOM por texto na tag
    const bFilter = search => {
        return $('b').filter(function() {
            return $(this).text().trim() == search;
        }).first().closest('td').text().split(':')[1].trim();
    }
    
    retorno.MATRICULA =  bFilter('MATRÍCULA:');
    retorno.NOME = bFilter('ALUNO(A):');
    retorno.CURSO = bFilter('CURSO:');
    retorno.CR = bFilter('CR:');

    /*INICIO sessão de materias do comprovante*/
    let tabelaMaterias = $('table').find('table').eq(5);
    retorno.MATERIAS_COMPROVANTE = [];

    tabelaMaterias.children('thead').find('tr').each((index,element) => {
        let colunas = $(element).find('th');
        let linhaRetorno = {};
        if(colunas.eq(0).text().trim() != ''){
            linhaRetorno.CODIGOMATERIA = colunas.eq(0).text().trim();
            linhaRetorno.NOMEMATERIA = colunas.eq(1).text().trim();
            linhaRetorno.CH = colunas.eq(2).text().trim();
            linhaRetorno.TURMA = colunas.eq(3).text().trim();
            linhaRetorno.DIA = colunas.eq(5).text().trim();
            linhaRetorno.HORARIO = colunas.eq(6).text().trim();
            linhaRetorno.LOCAL = colunas.eq(7).text().trim();
            linhaRetorno.DOCENTE = colunas.eq(8).text().trim();
            retorno.MATERIAS_COMPROVANTE.push(linhaRetorno);
        }
    });
    
    let horariosAula = [];

    tabelaMaterias.children('tbody').find('tr').each((index,element) => {
        let colunas = $(element).find('td');
        let linhaRetorno = {};
        if(colunas.eq(8).text().trim() != ''){
            linhaRetorno.CODIGOMATERIA = colunas.eq(0).text().trim();
            if(linhaRetorno.CODIGOMATERIA == ''){
                linhaRetorno.CODIGOMATERIA = retorno.MATERIAS_COMPROVANTE[index].CODIGOMATERIA;
            }
            linhaRetorno.NOMEMATERIA = colunas.eq(1).text().trim();
            linhaRetorno.CH = colunas.eq(2).text().trim();
            linhaRetorno.TURMA = colunas.eq(3).text().trim();
            linhaRetorno.TURMA += '-'+colunas.eq(4).text().trim();
            linhaRetorno.DIA = colunas.eq(5).text().trim();
            linhaRetorno.HORARIO = colunas.eq(6).text().trim();
            linhaRetorno.LOCAL = colunas.eq(7).text().trim();
            linhaRetorno.DOCENTE = colunas.eq(8).text().trim();
            if(linhaRetorno.DIA != 'CMB'){
                horariosAula.push({
                    MATERIA: linhaRetorno.CODIGOMATERIA,
                    HORARIO_INI : linhaRetorno.HORARIO.split('/')[0].trim(),
                    HORARIO_FIM : linhaRetorno.HORARIO.split('/')[1].trim(),
                    DIA : linhaRetorno.DIA
                })
            }
            retorno.MATERIAS_COMPROVANTE.push(linhaRetorno);
        }
    });
    /*FIM*/

    //INICIO Monta os horários das materias
    let tabelaQuadroAulas = $('#curriculoTable');
    retorno.MATERIAS_HORARIOS = [];

    const filterHorarios = (key,dia) => {
        let retorno = '';
        horariosAula.forEach(element => {
            if(Date.parse('01/01/2019 '+key) >= Date.parse('01/01/2019 '+element.HORARIO_INI) && Date.parse('01/01/2011 '+key) <= Date.parse('01/01/2011 '+element.HORARIO_FIM) && element.DIA == dia){
                retorno = element.MATERIA;
                return;
            }
        });
        return retorno;
    }

    tabelaQuadroAulas.children('tbody').find('tr').each((index,element) => {
        let colunas = $(element).find('td');
        let linhaRetorno = {};
        if(colunas.eq(0).text().trim() != ''){
            linhaRetorno.HORARIO = colunas.eq(0).text().trim();
            linhaRetorno.SEGUNDA = filterHorarios(linhaRetorno.HORARIO,'SEG');
            linhaRetorno.TERCA = filterHorarios(linhaRetorno.HORARIO,'TER');
            linhaRetorno.QUARTA = filterHorarios(linhaRetorno.HORARIO,'QUA');
            linhaRetorno.QUINTA =filterHorarios(linhaRetorno.HORARIO,'QUI');
            linhaRetorno.SEXTA = filterHorarios(linhaRetorno.HORARIO,'SEX');
            linhaRetorno.SABADO = filterHorarios(linhaRetorno.HORARIO,'SAB');
            retorno.MATERIAS_HORARIOS.push(linhaRetorno);
        }
    });
    /*FIM*/

    /*LOCAIS DE AULA*/
    retorno.LOCAIS_AULA = [];
    let tabelaLocaisAula = $('table').find('table').eq(6);
    tabelaLocaisAula.children('tbody').find('tr').each((index,element) => {
        let colunas = $(element).find('td');
        let linhaRetorno = {};
        if(colunas.eq(0).text().trim() != ''){
            linhaRetorno.INFO_1 = colunas.eq(0).text().trim();
            linhaRetorno.INFO_2 = colunas.eq(1).text().trim();
            linhaRetorno.INFO_3 = colunas.eq(2).text().trim();
            linhaRetorno.INFO_4 = colunas.eq(3).text().trim();
            retorno.LOCAIS_AULA.push(linhaRetorno);
        }
    });
    

    return retorno;
};

const verificaLogin = (html) => {
    //instancia do HTML para Objeto
    const $ = helper.instanceCheerio(html);
    if($('[name=usuarioForm]').length){
        return false;
    }
    else{
        return true;
    }
} 

module.exports = {
    async execute(req,res){
        var dados = {
            cpf : req.body.cpf,
            senha : req.body.senha
        }

        retornar = (x) => res.send(processaDados(x));

        request = request.defaults({ jar : request.jar() }); //preserva a sessão jar
        request({
            url:"https://siac.ufba.br/SiacWWW/LogonSubmit.do",
            method:"POST",
            form: dados
        },
        (error, response, body) => {
            if(!verificaLogin(body)){
                res.send({ERRO_LOGIN : true})
                return;
            }
            
            request({
                url:"https://siac.ufba.br/SiacWWW/ConsultarComprovanteMatricula.do",
                method:"GET",
                encoding:null
            }, 
            function (error, response, body) {
                retornar(body);
            });
        });
        
        return true;
    }

};

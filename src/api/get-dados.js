var request = require('request');
const login = require('./verifica-login');
const comprovante = require('./get-comprovante');
const componentesCursados = require('./get-componentes-cursados');
const materiasObrigatorias = require('./get-materias-obrigatorias');

/*callback que verifica as credenciais, consulta o comprovante de matricula
e chama a callback de componentes curriculares cursados*/
const callback1 = async (error, response, body) => {
    if (!await login.run(body)) {
        res.send({ ERRO_LOGIN: true })
        return;
    }

    request({
        url: "https://siac.ufba.br/SiacWWW/ConsultarComprovanteMatricula.do",
        method: "GET",
        encoding: null
    },
        callback2
    );
};

/*callback que consulta os componentes curriculares cursados*/
const callback2 = async (error, response, body) => {
    
    retorno.COMPROVANTE = await comprovante.run(body);
    request({
        url: "https://siac.ufba.br/SiacWWW/ConsultarComponentesCurricularesCursados.do",
        method: "GET",
        encoding: null
    },
        callback3
    )
};

const callback3 = async (error, response, body) => {
    retorno.COMPONENTES_CURSADOS = await componentesCursados.run(body);
    request({
        url: "https://siac.ufba.br/SiacWWW/ConsultarDisciplinasObrigatorias.do",
        method: "GET",
        encoding: null
    },
    callback4
    )
};

const callback4 = async (error, response, body) => {
    retorno.MATERIAS_OBRIGATORIAS = await materiasObrigatorias.run(body);
    request({
        url: "https://siac.ufba.br/SiacWWW/GerarComprovanteMatricula.do",
        method: "GET",
        encoding: null,
        headers: { 
            'Accept': 'text/pdf', 
            'Accept-Encoding': 'identity'
          }  
    },
    callback5
    )
};
const callback5 = async (error, response, body) => {
    retorno.COMPROVANTE_PDF = JSON.stringify(body.toString('base64'));
    retornar();
};


module.exports = {
    async execute(req, res) {
        var dados = {
            cpf: req.body.cpf,
            senha: req.body.senha
        }

        //monta o padrão de retorno
        retorno = {};

        //define uma função para retornar os dados
        retornar = () => res.send(retorno);

        request = request.defaults({ jar: request.jar() }); //preserva a sessão jar
        request({
            url: "https://siac.ufba.br/SiacWWW/LogonSubmit.do",
            method: "POST",
            form: dados
        },
            callback1
        );

        return true;
    }

};
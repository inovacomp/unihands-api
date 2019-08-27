const helper = require('../helpers/helpers');

module.exports = {
    async run(html) {
        //instancia do HTML para Objeto
        const $ = helper.instanceCheerio(html);
        if ($('[name=usuarioForm]').length) {
            return false;
        }
        else {
            return true;
        }
    }
}
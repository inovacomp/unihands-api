const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports = {
    instanceCheerio(html) {
        return cheerio.load(iconv.decode(Buffer.from(html),"ISO-8859-1"),{ decodeEntities: false });
    }
}
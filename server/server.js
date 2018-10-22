const request = require('request');
const cheerio = require('cheerio');

request('https://rate.am', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let tr = $('table#rb tr').map(function(i, el) {
      return $(this).text();
    }).get().join(' ');
    console.log(tr)
  }
});




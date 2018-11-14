const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql111",
  port: 3306,
  database: "rate"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

function setInstitutions(url, institution_type) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      let $ = cheerio.load(html);
      let trs = $('table#rb tr');
      let institution = [];
      let institutions = [];

      trs.find('td.bank a').each(function (i, e) {
        institution[i] = $(this).text().trim();
      });

      institution.forEach(i =>{
        institutions.push([i, institution_type])
      });

      let sql = `INSERT INTO institutions (name, institution_type) VALUES ?`;
      con.query(sql, [institutions], function (err, result) {
        if (err) throw err;
        console.log("successfully inserted");
      });
    }
  });
}
setInstitutions('http://rate.am/en/armenian-dram-exchange-rates/investment-organizations/non-cash', 'investmentOrganizations');
setInstitutions('http://rate.am/am/armenian-dram-exchange-rates/credit-organizations/cash', 'creditOrganizations');
setInstitutions('https://rate.am/am/armenian-dram-exchange-rates/exchange-points/cash', 'exchangesPoints');
setInstitutions('https://rate.am', 'banks');





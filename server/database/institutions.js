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

request('https://rate.am', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table#rb tr');
    let bank = [];
    let institutions = [];

    trs.find('td.bank a').each(function (i, e) {
      bank[i] = $(this).text().trim();
    });

    bank.forEach(bank =>{
      institutions.push([bank, true])
    });


    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      let sql = `INSERT INTO institutions (name, is_bank) VALUES ?`;
      con.query(sql, [institutions], function (err, result) {
        if (err) throw err;
        console.log("successfully inserted");
      });
    });
  }
});

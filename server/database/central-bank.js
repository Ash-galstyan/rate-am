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

let monthValues = [{1: []},{2: []},{3: []},{4: []},{5: []},{6: []},{7: []},{8: []},{9: []},{10: []},{11: []},{12: []},];
let monthValue = [];
let values = [];

request({
  url: 'http://rate.am/en/armenian-dram-exchange-rates/central-bank-armenia',
}, function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table.cb tr:not(.btm)');
    trs.each(function(i,e) {
      let tds = $(e).find('td');
      values[i] = [];
      tds.each(function (idx, td) {
        values[i].push($(td).text().trim())
      })
    });
    for(let i = 0; i < monthValues.length; i++) {
      for(let j = 1; j < values.length; j++) {
        monthValues[i][i+1].push(values[j][i+1])
      }
    }

    for(let i = 1; i < values.length; i++) {
      for(let j = 1; j < values[i].length; j++) {
        monthValue[j - 1] = monthValue[j - 1] ? monthValue[j - 1] : [];
        monthValue[j - 1].push({[i]: values[i][j]})
      }
    }

    console.log(monthValue)
    // let sql = `INSERT INTO cb_month (month) VALUES ?`;
    // con.query(sql, [cbmonth], function (err, result) {
    //   if (err) throw err;
    //   console.log("successfully inserted");
    // });
  }
});






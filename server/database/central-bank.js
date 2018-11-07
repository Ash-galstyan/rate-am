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

let monthValue = [];
let values = [];
let cbDate = [];
let cbValues = [];
let cbRates =[];


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

    for(let i = 1; i < values.length; i++) {
      for(let j = 1; j < values[i].length; j++) {
        monthValue[j - 1] = monthValue[j - 1] ? monthValue[j - 1] : [];
        monthValue[j - 1].push({[i]: values[i][j]})
      }
    }

    for(let i = 0; i < monthValue.length; i++) {
      for(let j = 0; j < monthValue[i].length; j++) {
        let month = i<10 ? `0${i}` : `${i}`;
        let day = j+1<10 ? `0${j+1}` : `${j+1}`;
        if (monthValue[i][j][j+1] !== 'X') {
          cbDate.push(`2018-${month}-${day}`);
        }
        cbValues.push(monthValue[i][j][j+1])
      }
    }

    for (let i = 0; i < cbValues.length; i++) {
      if(cbValues[i] === 'Sunday') {
        cbRates.push([cbDate[i], null, 6]);
      } else if(cbValues[i] === '') {
        cbRates.push([cbDate[i], 0, 6]);
      } else if(cbValues[i] !== 'X') {
        cbRates.push([cbDate[i], cbValues[i], 6]);
      }
    }

    let sql = `INSERT INTO cb_rates (date, value, currency_id) VALUES ?`;
    con.query(sql, [cbRates], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});






const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const cron = require("node-cron");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql111",
  port: 3306,
  database: "rate"
});

let bankId = [];
let currencyId = [];
let currencyName = [];

con.connect(function (err) {
  if (err) throw err;
  con.query("SELECT * FROM institutions", function (err, result, fields) {
    if (err) throw err;
    result.forEach(res => {
      bankId.push(res.id)
    });
  });
  con.query("SELECT * FROM currency", function (err, result, fields) {
    if (err) throw err;
    result.forEach(res => {
      currencyId.push(res.id);
      currencyName.push(res.name)
    });
  });
});

cron.schedule("5,20,35,50 * * * *", function () {
  request('https://rate.am', function (error, response, html) {
    if (!error && response.statusCode === 200) {
      let $ = cheerio.load(html);
      let trs = $('table#rb tr');
      let currencyUSDBuy = [];
      let currencyUSDSell = [];
      let currencyEURBuy = [];
      let currencyEURSell = [];
      let currencyRURBuy = [];
      let currencyRURSell = [];
      let currencyGBPBuy = [];
      let currencyGBPSell = [];
      let currencyBuy = {};
      let currencySell = {};
      let rates = [];
      let date = new Date();

      trs.find('td.bank a').each(function (i, e) {
        let value = $(this).parent().parent().find('td.date').next();
        currencyUSDBuy[i] = value.text() !== '' ? parseFloat(`${value.text()}`) : null;
        currencyUSDSell[i] = value.next().text() !== '' ? parseFloat(`${value.next().text()}`) : null;
        currencyEURBuy[i] = value.next().next().text() !== '' ? parseFloat(`${value.next().next().text()}`) : null;
        currencyEURSell[i] = value.next().next().next().text() !== '' ? parseFloat(`${value.next().next().next().text()}`) : null;
        currencyRURBuy[i] = value.next().next().next().next().text() !== '' ? parseFloat(`${value.next().next().next().next().text()}`) : null;
        currencyRURSell[i] = value.next().next().next().next().next().text() !== '' ? parseFloat(`${value.next().next().next().next().next().text()}`) : null;
        currencyGBPBuy[i] = value.next().next().next().next().next().next().text() !== '' ? parseFloat(`${value.next().next().next().next().next().next().text()}`) : null;
        currencyGBPSell[i] = value.next().next().next().next().next().next().next().text() !== '' ? parseFloat(`${value.next().next().next().next().next().next().next().text()}`) : null;
      });
      currencyBuy['USD'] = currencyUSDBuy;
      currencyBuy['EUR'] = currencyEURBuy;
      currencyBuy['RUR'] = currencyRURBuy;
      currencyBuy['GBP'] = currencyGBPBuy;
      currencySell['USD'] = currencyUSDSell;
      currencySell['EUR'] = currencyEURSell;
      currencySell['RUR'] = currencyRURSell;
      currencySell['GBP'] = currencyGBPSell;



        for (let i = 0; i < bankId.length; i++) {
          for (let j = 0; j < currencyName.length; j++) {
            rates.push([bankId[i], currencyBuy[currencyName[j]][i], currencySell[currencyName[j]][i], date.getTime()/1000, currencyId[j]]);
          }
        }
        let sql = `INSERT INTO rates (bank_id, value_buy, value_sell, date, currency_id) VALUES?`;
        con.query(sql, [rates], function (err, result) {
          if (err) throw err;
          console.log("successfully inserted");
        });

    }
  });
});





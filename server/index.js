const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql111',
  database: 'rate'
});

con.connect();

app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

app.get('/rates', function (req, res) {
  let banks = {}, currency = {}, lastDate, lastRates, finalResult = [];
  con.query('SELECT * FROM rates', function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      con.query('SELECT * FROM institutions', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          banks[res.id] = res.name;
        });
        con.query('SELECT * FROM rates WHERE date = ' + lastDate, function (error, results, fields) {
          if (error) throw error;
          results.forEach(rate => {
            const bank = finalResult.find(o => rate.bank_id === o.bank_id);
            if (bank) {
              bank.currency.push({
                currency_id: rate.currency_id,
                currency_Description: currency[`${rate.currency_id}`],
                value_buy: rate.value_buy,
                value_sell: rate.value_sell
              });
            } else {
              const bank = {
                bank_id: rate.bank_id,
                bank_description: banks[rate.bank_id],
                currency: [],
                date: rate.date
              };
              finalResult.push(bank);
              bank.currency.push({
                currency_id: rate.currency_id,
                currency_Description: currency[rate.currency_id],
                value_buy: rate.value_buy,
                value_sell: rate.value_sell
              })
            }
          });
          res.send(finalResult)
        });
      });
    });
  });
});
app.listen(80, function () {
  console.log('Node app is running');
});

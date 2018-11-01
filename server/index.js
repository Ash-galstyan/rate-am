const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

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

app.use(cors({ origin: '*' }));

app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

app.get('/api/rates', function (req, res) {
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

app.get('/api/averageRates', function (req, res) {
  let startPreviousDate = (new Date().setHours(0,0,0,0)/1000).toFixed(0)-24*60*60;
  let endPreviousDate = (new Date().setHours(23,59,59,999)/1000).toFixed(0)-24*60*60;
  let currencyLength, banks = {}, currency = {}, lastDate, finalResult = [], previousRatesBuy =[], previousRatesSell =[];
  con.query('SELECT * FROM rates', function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      currencyLength = results.length;
      con.query('SELECT * FROM institutions', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          banks[res.id] = res.name;
        });
        con.query('SELECT * FROM rates WHERE date BETWEEN ' + startPreviousDate + ' AND ' + endPreviousDate, function (error, results, fields) {
          if (error) throw error;
          for(let i = (results.length-currencyLength); i<results.length; i++) {
            for(let j =0; j<results.length; j++) {
              if(!results[i].value_buy) {
                results[i] = results[i-j].value_buy
              }
              if(!results[i].value_sell) {
                results[i] = results[i-j].value_sell
              }
            }
            previousRatesBuy.push(results[i].value_buy);
            previousRatesSell.push(results[i].value_sell);
          }
          con.query('SELECT * FROM rates WHERE date = ' + lastDate, function (error, results, fields) {
            if (error) throw error;
            let maxBuy = [], maxSell = [], minBuy = [], minSell = [], averageBuy = [], averageSell = [], ratesCountBuy =[], ratesCountSell = [];
            results.forEach(rate => {
              const cur = finalResult.find(o => rate.currency_id === o.currency_id);
              if (cur) {
                cur.buy.push(rate.value_buy);
                cur.sell.push(rate.value_sell);
              } else {
                const cur = {
                  currency_id: rate.currency_id,
                  currency_description: currency[rate.currency_id],
                  buy: [],
                  sell: [],
                  date: rate.date
                };
                finalResult.push(cur);
                cur.buy.push(rate.value_buy);
                cur.sell.push(rate.value_sell);
              }
            });
            for (let i = 0; i < finalResult.length; i++) {
              maxBuy[i] = 0;
              minBuy[i] = 9999999;
              maxSell[i] = 0;
              minSell[i] = 9999999;
              averageBuy[i] = 0;
              averageSell[i] = 0;
              ratesCountBuy[i] = 0;
              ratesCountSell[i] = 0;
              for (let j = 0; j < finalResult[i].buy.length; j++) {
                maxBuy[i] = maxBuy[i] > finalResult[i].buy[j] ? maxBuy[i] : finalResult[i].buy[j];
                minBuy[i] = minBuy[i] != null && minBuy[i] < finalResult[i].buy[j] ? minBuy[i] : finalResult[i].buy[j];
                maxSell[i] = maxSell[i] > finalResult[i].sell[j] ? maxSell[i] : finalResult[i].sell[j];
                minSell[i] = minSell[i] != null && minSell[i] < finalResult[i].sell[j] ? minSell[i] : finalResult[i].sell[j];
                averageBuy[i] += finalResult[i].buy[j];
                averageSell[i] += finalResult[i].sell[j];
                ratesCountBuy[i] += !finalResult[i].buy[j] ? 0 : 1;
                ratesCountSell[i] += !finalResult[i].sell[j] ? 0 : 1
              }
              finalResult[i].buy = {
                max: maxBuy[i],
                min: minBuy[i],
                average: (averageBuy[i]/ratesCountBuy[i]).toFixed(2),
                fluctuation: (averageBuy[i]/ratesCountBuy[i]-previousRatesBuy[i]).toFixed(2)
              };
              finalResult[i].sell = {
                max: maxSell[i],
                min: minSell[i],
                average: (averageSell[i]/ratesCountSell[i]).toFixed(2),
                fluctuation: (averageSell[i]/ratesCountSell[i]-previousRatesSell[i]).toFixed(2)
              }
            }
            res.send(finalResult)
          });
        });
      });
    });
  });
});

app.listen(80, function () {
  console.log('Node app is running');
});

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

app.use(cors({origin: 'http://localhost:8888'}));

app.get('/', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return res.send({ error: true, message: 'hello' })
});

app.get('/rates', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true); 
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

// app.get('/averageRates', function (req, res) {
//   let banks = {}, currency = {}, lastDate, finalResult = [];
//   con.query('SELECT * FROM rates', function (error, results, fields) {
//     if (error) throw error;
//     lastDate = results[results.length - 1].date;
//     con.query('SELECT * FROM currency', function (error, results, fields) {
//       if (error) throw error;
//       results.map(res => {
//         currency[res.id] = res.name;
//       });
//       con.query('SELECT * FROM institutions', function (error, results, fields) {
//         if (error) throw error;
//         results.map(res => {
//           banks[res.id] = res.name;
//         });
//         con.query('SELECT * FROM rates WHERE date = ' + lastDate, function (error, results, fields) {
//           if (error) throw error;
//           let maxBuy = 0, maxSell = 0, minBuy = 9999, minSell = 9999, averageBuy = 0, averageSell = 0, fluctuationBuy = 0, fluctuationSell = 0;
//           results.forEach(rate => {
//             const cur = finalResult.find(o => rate.currency_id === o.currency_id);
//             if (cur) {
//               maxBuy = maxBuy > rate.value_buy ? maxBuy : rate.value_buy;
//               minBuy = minBuy < rate.value_buy ? minBuy : rate.value_buy;
//               maxSell = maxSell > rate.value_sell ? maxSell : rate.value_sell;
//               minSell = minSell < rate.value_sell ? minSell : rate.value_sell;
//               cur.buy = {
//                 max: maxBuy,
//                 min: minBuy,
//                 average: 4,
//                 fluctuation: 4
//               };
//               cur.sell = {
//                 max: maxSell,
//                 min: minSell,
//                 average: 4,
//                 fluctuation: 4
//               };
//             } else {
//               const cur = {
//                 currency_id: rate.currency_id,
//                 currency_description: currency[rate.currency_id],
//                 date: rate.date
//               };
//               maxBuy = maxBuy > rate.value_buy ? maxBuy : rate.value_buy;
//               minBuy = minBuy < rate.value_buy ? minBuy : rate.value_buy;
//               maxSell = maxSell > rate.value_sell ? maxSell : rate.value_sell;
//               minSell = minSell < rate.value_sell ? minSell : rate.value_sell;
//               finalResult.push(cur);
//               cur.buy = {
//                 max: maxBuy,
//                 min: minBuy,
//                 average: 4,
//                 fluctuation: 4
//               };
//               cur.sell = {
//                 max: maxSell,
//                 min: minSell,
//                 average: 4,
//                 fluctuation: 4
//               };
//             }
//
//
//
//
//             // const bank = finalResult.find(o => rate.bank_id === o.bank_id);
//             // if (bank) {
//             //   bank.currency.push({
//             //     currency_id: rate.currency_id,
//             //     currency_Description: currency[`${rate.currency_id}`],
//             //     value_buy: rate.value_buy,
//             //     value_sell: rate.value_sell
//             //   });
//             // } else {
//             //   const bank = {
//             //     bank_id: rate.bank_id,
//             //     bank_description: banks[rate.bank_id],
//             //     currency: [],
//             //     date: rate.date
//             //   };
//             //   finalResult.push(bank);
//             //   bank.currency.push({
//             //     currency_id: rate.currency_id,
//             //     currency_Description: currency[rate.currency_id],
//             //     value_buy: rate.value_buy,
//             //     value_sell: rate.value_sell
//             //   })
//             // }
//           });
//           res.send(finalResult)
//         });
//       });
//     });
//   });
// });

app.listen(80, function () {
  console.log('Node app is running');
});

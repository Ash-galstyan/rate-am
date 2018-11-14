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

let sqlJoin = `SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy,` +
  `rates.date AS date, rates.currency_id AS currency_id, institutions.id AS institution_id,` +
  `institutions.institution_type AS institution_type FROM rates JOIN institutions ON rates.institutions_id = institutions.id`;

function institutionsApi(url, institutionType) {
  app.get(url, function (req, res) {
    let institutions = {}, currency = {}, lastDate, finalResult = [];
    let sqlDate = sqlJoin + ` WHERE institution_type = '${institutionType}'`;
    con.query(sqlDate, function (error, results, fields) {
      if (error) throw error;
      lastDate = results[results.length - 1].date;
      con.query('SELECT * FROM currency', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          currency[res.id] = res.name;
        });
        con.query(`SELECT * FROM institutions WHERE institution_type = '${institutionType}'`, function (error, results, fields) {
          if (error) throw error;
          results.map(res => {
            institutions[res.id] = res.name;
          });
          let sql = sqlJoin + ` WHERE institution_type = '${institutionType}' AND date = ` + lastDate;
          con.query(sql, function (error, results, fields) {
            if (error) throw error;
            results.forEach(rate => {
              const institution = finalResult.find(o => rate.institution_id === o.institution_id);
              if (institution) {
                institution.currency.push({
                  currency_id: rate.currency_id,
                  currency_Description: currency[`${rate.currency_id}`],
                  value_buy: rate.value_buy,
                  value_sell: rate.value_sell
                });
              } else {
                const institution = {
                  institution_id: rate.institution_id,
                  description: institutions[rate.institution_id],
                  currency: [],
                  date: rate.date
                };
                finalResult.push(institution);
                institution.currency.push({
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
}
institutionsApi('/api/bankRates', 'banks');
institutionsApi('/api/exchangesPointsRates', 'exchangesPoints');
institutionsApi('/api/creditOrganizationsRates', 'creditOrganizations');
institutionsApi('/api/investmentOrganizationsRates', 'investmentOrganizations');

app.get('/api/bankAverageRates', function (req, res) {
  // let startPreviousDayDate = (new Date().setHours(0,0,0,0)/1000).toFixed(0)-24*60*60;
  // let endPreviousDayDate = (new Date().setHours(23,59,59,999)/1000).toFixed(0)-24*60*60;
  let startPreviousDayDate = (new Date().setHours(0,0,0,0)/1000).toFixed(0);
  let endPreviousDayDate = (new Date().setHours(23,59,59,999)/1000).toFixed(0);
  let currencyLength, banks = {}, currency = {}, lastDate, previousDayLastDate, finalResult = [], previousLastDateValues = [], previousDayRatesBuy =[], previousDayRatesSell =[];
  let sqlDate = sqlJoin + ` WHERE institution_type = 'banks'`;
  con.query(sqlDate, function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      currencyLength = results.length;
        let sql = sqlJoin + ` WHERE institution_type = 'banks'` +
          ` AND date BETWEEN ` + startPreviousDayDate + ` AND ` + endPreviousDayDate;
        con.query(sql, function (error, results, fields) {
          if (error) throw error;
          previousDayLastDate = results[results.length - 1].date;
          let sqlPreviousDayLastDate = sqlJoin + ` WHERE institution_type = 'banks' AND date = ` + previousDayLastDate;
          con.query(sqlPreviousDayLastDate, function (error, results, fields) {
            if (error) throw error;
            let  previousDayAverageBuy = [], previousDayAverageSell = [],
              previousDayRatesCountBuy = [], previousDayRatesCountSell = [];
            results.forEach(rate => {
              const curr = previousLastDateValues.find(o => rate.currency_id === o.currency_id);
              if (curr) {
                curr.buy.push(rate.value_buy);
                curr.sell.push(rate.value_sell);
              } else {
                const curr = {
                  buy: [],
                  sell: []
                };
                previousLastDateValues.push(curr);
                curr.buy.push(rate.value_buy);
                curr.sell.push(rate.value_sell);
              }
            });
            for (let i = 0; i < previousLastDateValues.length; i++) {
              previousDayAverageBuy[i] = 0;
              previousDayAverageSell[i] = 0;
              previousDayRatesCountBuy[i] = 0;
              previousDayRatesCountSell[i] = 0;
              for (let j = 0; j < previousLastDateValues[i].buy.length; j++) {
                previousDayAverageBuy[i] += previousLastDateValues[i].buy[j];
                previousDayAverageSell[i] += previousLastDateValues[i].sell[j];
                previousDayRatesCountBuy[i] += !previousLastDateValues[i].buy[j] ? 0 : 1;
                previousDayRatesCountSell[i] += !previousLastDateValues[i].sell[j] ? 0 : 1
              }
              previousDayRatesBuy[i] = (previousDayAverageBuy[i] / previousDayRatesCountBuy[i]).toFixed(2);
              previousDayRatesSell[i] = (previousDayAverageSell[i] / previousDayRatesCountSell[i]).toFixed(2)
            }
            let sqlLastDate = sqlJoin + ` WHERE institution_type = 'banks' AND date = ` + lastDate;
            con.query(sqlLastDate, function (error, results, fields) {
              if (error) throw error;
              let maxBuy = [], maxSell = [], minBuy = [], minSell = [], averageBuy = [], averageSell = [],
                ratesCountBuy = [], ratesCountSell = [];
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
                minBuy[i] = Infinity;
                maxSell[i] = 0;
                minSell[i] = Infinity;
                averageBuy[i] = 0;
                averageSell[i] = 0;
                ratesCountBuy[i] = 0;
                ratesCountSell[i] = 0;
                for (let j = 0; j < finalResult[i].buy.length; j++) {
                  maxBuy[i] = maxBuy[i] > finalResult[i].buy[j] ? maxBuy[i] : finalResult[i].buy[j];
                  minBuy[i] = finalResult[i].buy[j] == null || minBuy[i] < finalResult[i].buy[j] ? minBuy[i] : finalResult[i].buy[j];
                  maxSell[i] = maxSell[i] > finalResult[i].sell[j] ? maxSell[i] : finalResult[i].sell[j];
                  minSell[i] = finalResult[i].sell[j] == null || minSell[i] < finalResult[i].sell[j] ? minSell[i] : finalResult[i].sell[j];
                  averageBuy[i] += finalResult[i].buy[j];
                  averageSell[i] += finalResult[i].sell[j];
                  ratesCountBuy[i] += !finalResult[i].buy[j] ? 0 : 1;
                  ratesCountSell[i] += !finalResult[i].sell[j] ? 0 : 1
                }
                finalResult[i].buy = {
                  max: maxBuy[i],
                  min: minBuy[i],
                  average: (averageBuy[i] / ratesCountBuy[i]).toFixed(2),
                  fluctuation: (averageBuy[i] / ratesCountBuy[i] - previousDayRatesBuy[i]).toFixed(2)
                };
                finalResult[i].sell = {
                  max: maxSell[i],
                  min: minSell[i],
                  average: (averageSell[i] / ratesCountSell[i]).toFixed(2),
                  fluctuation: (averageSell[i] / ratesCountSell[i] - previousDayRatesSell[i]).toFixed(2)
                }
              }
              res.send(finalResult)
            });
          });
        });
      });
    });
});

app.get('/api/cbRates', function (req, res) {
  let currency = [], currencyId = [], finalResult = [];
  con.query('SELECT * FROM currency', function (error, results, fields) {
    if (error) throw error;
    results.map(res => {
      currency[res.id] = res.name;
      currencyId.push(res.id)
    });
    let sql = "SELECT * FROM cb_rates";
    con.query(sql, function (error, results, fields) {
      if (error) throw error;
      for(let i=0; i<currencyId.length; i++) {
        let j=0;
        finalResult.push({
          currency_id: currencyId[i],
          currency_description: currency[currencyId[i]],
          values: []
        });
        for(let k=0; k<12; k++) {
          finalResult[i].values.push([]);
          for(j; j<results.length; j++) {
            if(results[j].currency_id === currencyId[i] && j+1<results.length && `${results[j].date}`.slice(0, 10).slice(4, 7) === `${results[`${j+1}`].date}`.slice(0, 10).slice(4, 7)) {
              finalResult[i].values[k].push({
                date: `${results[j].date}`.slice(0, 10),
                value: results[j].value
              })
            } else if (results[j].currency_id === currencyId[i]) {
              finalResult[i].values[k].push({
                date: `${results[j].date}`.slice(0, 10),
                value: results[j].value
              });
              j++;
              break;
            }
          }
        }
      }
      res.send(finalResult)
    });
  })
});

app.get('/api/cbAverageRates', function (req, res) {
  let currency = [], currencyId = [], finalResult = [];
  con.query('SELECT * FROM currency', function (error, results, fields) {
    if (error) throw error;
    results.map(res => {
      currency[res.id] = res.name;
      currencyId.push(res.id)
    });
    let sql = "SELECT * FROM cb_rates";
    con.query(sql, function (error, results, fields) {
      if (error) throw error;
      let maxRate = [], minRate = [], averageRate = [], ratesfluctuation = [], ratesCount = [];
      for(let i=0; i<currencyId.length; i++) {
        let j=0;
        finalResult.push({
          currency_id: currencyId[i],
          currency_description: currency[currencyId[i]],
          values: []
        });
        for(let k=0; k<12; k++) {
          finalResult[i].values.push([]);
          for(j; j<results.length; j++) {
            if(results[j].currency_id === currencyId[i] && j+1<results.length && `${results[j].date}`.slice(0, 10).slice(4, 7) === `${results[`${j+1}`].date}`.slice(0, 10).slice(4, 7)) {
                finalResult[i].values[k].push({
                  date: `${results[j].date}`.slice(0, 10),
                  value: results[j].value
                })
              } else if (results[j].currency_id === currencyId[i]) {
              finalResult[i].values[k].push({
                date: `${results[j].date}`.slice(0, 10),
                value: results[j].value
              });
              j++;
              break;
            }
          }
        }
      }
      for (let i = 0; i < finalResult.length; i++) {
        for (let j = 0; j < finalResult[i].values.length; j++) {
          maxRate[j] = 0;
          minRate[j] = Infinity;
          averageRate[j] = 0;
          ratesfluctuation[j] = 0;
          ratesCount[j] = 0;
         for(let k =0; k<finalResult[i].values[j].length; k++) {
           maxRate[j] = maxRate[j] > finalResult[i].values[j][k].value ? maxRate[j] : finalResult[i].values[j][k].value;
           minRate[j] = finalResult[i].values[j][k].value == null || finalResult[i].values[j][k].value === 0 || minRate[j] < finalResult[i].values[j][k].value ? minRate[j] : finalResult[i].values[j][k].value;
           averageRate[j] += finalResult[i].values[j][k].value;
           ratesCount[j] += !finalResult[i].values[j][k].value || !finalResult[i].values[j][k].value === 0 ? 0 : 1;
         }
          finalResult[i].values[j] = {
            max: ratesCount[j] ? maxRate[j] : null,
            min: ratesCount[j] ? minRate[j] : null,
            average: ratesCount[j] ? (averageRate[j] / ratesCount[j]).toFixed(2) : null,
            fluctuation: averageRate[j-1] && averageRate[j] ? ((averageRate[j] / ratesCount[j]) - (averageRate[j-1] / ratesCount[j-1])).toFixed(2) : null
          };
        }
      }
      res.send(finalResult)
    });
  })
});


app.listen(80, function () {
  console.log('Node app is running');
});

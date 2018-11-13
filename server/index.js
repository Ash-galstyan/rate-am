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

app.get('/api/bankRates', function (req, res) {
  let banks = {}, currency = {}, lastDate, finalResult = [];
  let sqlDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
    "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
    "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_bank = 1";
  con.query(sqlDate, function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      con.query('SELECT * FROM institutions WHERE is_bank = 1', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          banks[res.id] = res.name;
        });
        let sql = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
          "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
          "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_bank = 1 AND date = " + lastDate;
        con.query(sql, function (error, results, fields) {
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
                description: banks[rate.bank_id],
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

app.get('/api/bankAverageRates', function (req, res) {
  let startPreviousDayDate = (new Date().setHours(0,0,0,0)/1000).toFixed(0)-24*60*60;
  let endPreviousDayDate = (new Date().setHours(23,59,59,999)/1000).toFixed(0)-24*60*60;
  let currencyLength, banks = {}, currency = {}, lastDate, previousDayLastDate, finalResult = [], previousLastDateValues = [], previousDayRatesBuy =[], previousDayRatesSell =[];
  let sqlDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
    "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
    "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id" +
    " = institutions.id WHERE is_bank = 1";
  con.query(sqlDate, function (error, results, fields) {
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
        let sql = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
          "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
          "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id" +
          " = institutions.id WHERE is_bank = 1" +
          " AND date BETWEEN " + startPreviousDayDate + ' AND ' + endPreviousDayDate;
        con.query(sql, function (error, results, fields) {
          if (error) throw error;
          previousDayLastDate = results[results.length - 1].date;
          let sqlPreviousDayLastDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
            "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
            "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id" +
            " = institutions.id WHERE is_bank = 1 AND date = " + previousDayLastDate;
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
            let sqlLastDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
              "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS bank_id," +
              "institutions.is_bank AS is_bank FROM rates JOIN institutions ON rates.institutions_id" +
              " = institutions.id WHERE is_bank = 1 AND date = " + lastDate;
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
                minBuy[i] = 9999999;
                maxSell[i] = 0;
                minSell[i] = 9999999;
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
});

app.get('/api/exchangesPointsRates', function (req, res) {
  let exchanges_points = {}, currency = {}, lastDate, finalResult = [];
  let sqlDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
    "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS exchangesPoint_id," +
    "institutions.is_exchanges_points AS is_exchanges_points FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_exchanges_points = 1"
  con.query(sqlDate, function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      con.query('SELECT * FROM institutions WHERE is_exchanges_points = 1', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          exchanges_points[res.id] = res.name;
        });
        let sql = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
          "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS exchangesPoint_id," +
          "institutions.is_exchanges_points AS is_exchanges_points FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_exchanges_points = 1 AND date = " + lastDate;
        con.query(sql, function (error, results, fields) {
          if (error) throw error;
          results.forEach(rate => {
            const exchanges_point = finalResult.find(o => rate.exchangesPoint_id === o.exchangesPoint_id);
            if (exchanges_point) {
              exchanges_point.currency.push({
                currency_id: rate.currency_id,
                currency_Description: currency[`${rate.currency_id}`],
                value_buy: rate.value_buy,
                value_sell: rate.value_sell
              });
            } else {
              const exchanges_point = {
                exchangesPoint_id: rate.exchangesPoint_id,
                description: exchanges_points[rate.exchangesPoint_id],
                currency: [],
                date: rate.date
              };
              finalResult.push(exchanges_point);
              exchanges_point.currency.push({
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

app.get('/api/creditOrganizationsRates', function (req, res) {
  let credit_organizations = {}, currency = {}, lastDate, finalResult = [];
  let sqlDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
    "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS creditOrganization_id," +
    "institutions.is_credit_organizations AS is_credit_organizations FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_credit_organizations = 1";
  con.query(sqlDate, function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      con.query('SELECT * FROM institutions WHERE is_credit_organizations = 1', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          credit_organizations[res.id] = res.name;
        });
        let sql = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
          "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS creditOrganization_id," +
          "institutions.is_credit_organizations AS is_credit_organizations FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_credit_organizations = 1 AND date = " + lastDate;
        con.query(sql, function (error, results, fields) {
          if (error) throw error;
          results.forEach(rate => {
            const credit_organization = finalResult.find(o => rate.creditOrganization_id === o.creditOrganization_id);
            if (credit_organization) {
              credit_organization.currency.push({
                currency_id: rate.currency_id,
                currency_Description: currency[`${rate.currency_id}`],
                value_buy: rate.value_buy,
                value_sell: rate.value_sell
              });
            } else {
              const credit_organization = {
                creditOrganization_id: rate.creditOrganization_id,
                description: credit_organizations[rate.creditOrganization_id],
                currency: [],
                date: rate.date
              };
              finalResult.push(credit_organization);
              credit_organization.currency.push({
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

app.get('/api/investmentOrganizationsRates', function (req, res) {
  let investment_organizations = {}, currency = {}, lastDate, finalResult = [];
  let sqlDate = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
    "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS investmentOrganization_id," +
    "institutions.is_investment_organizations AS is_investment_organizations FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_investment_organizations = 1";
  con.query(sqlDate, function (error, results, fields) {
    if (error) throw error;
    lastDate = results[results.length - 1].date;
    con.query('SELECT * FROM currency', function (error, results, fields) {
      if (error) throw error;
      results.map(res => {
        currency[res.id] = res.name;
      });
      con.query('SELECT * FROM institutions WHERE is_investment_organizations = 1', function (error, results, fields) {
        if (error) throw error;
        results.map(res => {
          investment_organizations[res.id] = res.name;
        });
        let sql = "SELECT rates.value_sell AS value_sell, rates.value_buy AS value_buy," +
          "rates.date AS date, rates.currency_id AS currency_id, institutions.id AS investmentOrganization_id," +
          "institutions.is_investment_organizations AS is_investment_organizations FROM rates JOIN institutions ON rates.institutions_id = institutions.id WHERE is_investment_organizations = 1 AND date = " + lastDate;
        con.query(sql, function (error, results, fields) {
          if (error) throw error;
          results.forEach(rate => {
            const investment_organization = finalResult.find(o => rate.investmentOrganization_id === o.investmentOrganization_id);
            if (investment_organization) {
              investment_organization.currency.push({
                currency_id: rate.currency_id,
                currency_Description: currency[`${rate.currency_id}`],
                value_buy: rate.value_buy,
                value_sell: rate.value_sell
              });
            } else {
              const investment_organization = {
                investmentOrganization_id: rate.investmentOrganization_id,
                description: investment_organizations[rate.investmentOrganization_id],
                currency: [],
                date: rate.date
              };
              finalResult.push(investment_organization);
              investment_organization.currency.push({
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
          minRate[j] = 9999999;
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

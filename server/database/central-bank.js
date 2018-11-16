const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const queryString = require('querystring');
const cron = require("node-cron");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql111",
  port: 3306,
  database: "rate"
});

let cbRates =[];
let currency = [];
let body = {};

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query('SELECT * FROM currency', function (error, results, fields) {
  if (error) throw error;
  results.map(res => {
    currency[res.name] = res.id;
  });
});

function bodyQuery(currencyDescription) {
   body = {
    __EVENTTARGET: 'ctl00$Content$dlCurrency',
    __EVENTARGUMENT: '',
    __LASTFOCUS: '',
    __VIEWSTATE: '',
    __SCROLLPOSITIONX: 0,
    __SCROLLPOSITIONY: 0,
    __EVENTVALIDATION: '/wEWTwL+raDpAgLC3NHXDgKTkL/QAgLpnNa3CwLFiYSZCwLE+qL2' +
    'DQLOhILoBALbhILoBALSoPTdDgKWs5JfAuzMSgK2++r3DQLf09GoDwKw+9r3DQKw+5r2DQKc' +
    's9JfApyAicMHAtmg7N0OAsXJuikCurb+NgKQs4ZfArv7gvYNAvHMXgL3/4OfAQLShObpBALShJ' +
    'boBALPyZ4pAubTiasPAvX/35wBAtmSo8IJAr77kvYNAo7W6YIPApuzkl8C5KDw3Q4CkvKb6QICwM' +
    'nuNgKh8sv2AgKn8sf2AgLYhNLpBALVydY2Asb60vcNAqKz/l8C8v+LnwEC7NOBqw8C+I2N6QcC8//' +
    'LnwECvMGrqQUCl9algg8CucvK0QkC+tzBpwYC+tyVzwQC+ty5qAwC+tzNhAcC+tzR4Q4C+tzl2gkC+' +
    'tyJtwEC+tydkAgC+tyhzQMCkeWT1AQCkeWnsQwCkeWL2AoCkeWftQICkeWj7g0CkeW3ywQCkeXbpwwC' +
    'keXvgAcCkeXz/Q4CkeWH1gkC1YbuoAwCkoOr+AUCmP2L5gwCjf2L5gwChNn90wYCwMqb0QgCurXDjggC' +
    '4ILj+QUC6riipw0C95SZ1AoC9sXqjQ7H6fVvHbRqFTNWr2BKICqO9/mV6g==',
    ctl00$Content$cbInfo$GoogleMapControl1$hdgmLocations: '',
    ctl00$Content$cbInfo$GoogleMapControl1$hdZoom: 15,
    ctl00$Content$dlCurrency: currencyDescription,
    ctl00$Content$dlYear: 2018,
    ctl00$pnAdds1$ChartCB1$dlCur: 'USD',
    ctl00$pnAdds1$ChartCB1$hdBId: 'c5ab18c6-dab7-4d53-9ec6-4c7c33171bf4',
    ctl00$pnAdds1$ChartCB1$hdPdt: 365
  };
  return body
}

function getCookies(callback){
    request('http://rate.am/en/armenian-dram-exchange-rates/central-bank-armenia',
      function (error, response) {
        if (!error && response.statusCode === 200) {
          return callback(null, response.headers['set-cookie'][0]);
        } else {
          return callback(error);
        }
      })
}
cron.schedule("* * * * *", function () {
  let sql = "DELETE FROM cb_rates";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("records deleted");
  });

  getCookies(function(err, cookie){
    if(!err) {
      function cb_values(currencyDescription) {
        request.post('http://rate.am/en/armenian-dram-exchange-rates/central-bank-armenia', {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              Cookie: cookie
            },
            body: queryString.stringify(bodyQuery(currencyDescription)),
          },
          function (error, response, html) {
            if (!error && response.statusCode === 200) {
              let values = [];
              let monthValue = [];
              let cbValues = [];
              let cbDate = [];
              let $ = cheerio.load(html);
              let trs = $('table.cb tr:not(.btm)');
              trs.each(function (i, e) {
                let tds = $(e).find('td');
                values[i] = [];
                tds.each(function (idx, td) {
                  values[i].push($(td).text().trim())
                })
              });
              for (let i = 1; i < values.length; i++) {
                for (let j = 1; j < values[i].length; j++) {
                  monthValue[j - 1] = monthValue[j - 1] ? monthValue[j - 1] : [];
                  monthValue[j - 1].push({[i]: values[i][j]})
                }
              }
              for (let i = 0; i < monthValue.length; i++) {
                for (let j = 0; j < monthValue[i].length; j++) {
                  let month = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
                  let day = j + 1 < 10 ? `0${j + 1}` : `${j + 1}`;
                  if (monthValue[i][j][j + 1] === '') {
                    cbDate.push(`2018-${month}-${day}`);
                    cbValues.push(0)
                  } else if (monthValue[i][j][j + 1] === 'Sunday') {
                    cbDate.push(`2018-${month}-${day}`);
                    cbValues.push(null)
                  } else if (monthValue[i][j][j + 1] !== 'X') {
                    cbDate.push(`2018-${month}-${day}`);
                    cbValues.push(monthValue[i][j][j + 1])
                  }
                }
              }
              for (let i = 0; i < cbValues.length; i++) {
                cbRates.push([cbDate[i], cbValues[i], currency[currencyDescription]]);
              }
              let sql = `INSERT INTO cb_rates (date, value, currency_id) VALUES ?`;
              con.query(sql, [cbRates], function (err, result) {
                if (err) throw err;
                console.log("successfully inserted");
              });
              cbRates = [];
            }
          });
      }
    }
    cb_values('USD');
    cb_values('EUR');
    cb_values('RUR');
    cb_values('GBP');
  });
});













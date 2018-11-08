const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const queryString = require('querystring');

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
let body = {
  ctl00$Content$dlCurrency: 'EUR',
  ctl00$Content$dlYear: 2018,
  ctl00$pnAdds1$ChartCB1$dlCur: 'USD',
  ctl00$pnAdds1$ChartCB1$hdBId: 'c5ab18c6-dab7-4d53-9ec6-4c7c33171bf4',
  ctl00$pnAdds1$ChartCB1$hdPdt: 365,
};
let monthValue = [];
let values = [];
let cbDate = [];
let cbValues = [];
let cbRates =[];

request.post({
  url:     'http://rate.am/en/armenian-dram-exchange-rates/central-bank-armenia',
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  json:true,
  body: JSON.stringify({
    '__EVENTTARGET': 'ctl00%24Content%24dlCurrency',
    '__EVENTARGUMENT': '',
    '__LASTFOCUS': '',
    '__VIEWSTATE': '',
    '__SCROLLPOSITIONX': 0,
    '__SCROLLPOSITIONY': 0,
    '__EVENTVALIDATION': '%2FwEWTwL%2BraDpAgLC3NHXDgKTkL%2FQAgLpnNa3CwLFiYSZCwLE%2BqL2DQLOhIL' +
    'oBALbhILoBALSoPTdDgKWs5JfAuzMSgK2%2B%2Br3DQLf09GoDwKw%2B9r3DQKw%2B5r2DQKcs9JfApyAicMHAtmg7' +
    'N0OAsXJuikCurb%2BNgKQs4ZfArv7gvYNAvHMXgL3%2F4OfAQLShObpBALShJboBALPyZ4pAubTiasPAvX%2F35wBAt' +
    'mSo8IJAr77kvYNAo7W6YIPApuzkl8C5KDw3Q4CkvKb6QICwMnuNgKh8sv2AgKn8sf2AgLYhNLpBALVydY2Asb60vcNAq' +
    'Kz%2Fl8C8v%2BLnwEC7NOBqw8C%2BI2N6QcC8%2F%2FLnwECvMGrqQUCl9algg8CucvK0QkC%2BtzBpwYC%2BtyVzwQC%' +
    '2Bty5qAwC%2BtzNhAcC%2BtzR4Q4C%2Btzl2gkC%2BtyJtwEC%2BtydkAgC%2BtyhzQMCkeWT1AQCkeWnsQwCkeWL2AoCk' +
    'eWftQICkeWj7g0CkeW3ywQCkeXbpwwCkeXvgAcCkeXz%2FQ4CkeWH1gkC1YbuoAwCkoOr%2BAUCmP2L5gwCjf2L5gwChNn9' +
    '0wYCwMqb0QgCurXDjggC4ILj%2BQUC6riipw0C95SZ1AoC9sXqjQ7H6fVvHbRqFTNWr2BKICqO9%2FmV6g%3D%3D',
    'ctl00%24Content%24cbInfo%24GoogleMapControl1%24hdgmLocations': '',
    'ctl00%24Content%24cbInfo%24GoogleMapControl1%24hdZoom': 15,
    'ctl00%24Content%24dlCurrency': 'EUR',
    'ctl00%24Content%24dlYear': 2018,
    'ctl00%24pnAdds1%24ChartCB1%24dlCur': 'USD',
    'ctl00%24pnAdds1%24ChartCB1%24hdBId': 'c5ab18c6-dab7-4d53-9ec6-4c7c33171bf4',
    'ctl00%24pnAdds1%24ChartCB1%24hdPdt': 365
  })
  },function (error, response, html) {
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
        let month = i+1<10 ? `0${i+1}` : `${i+1}`;
        let day = j+1<10 ? `0${j+1}` : `${j+1}`;
        if(monthValue[i][j][j+1] === '') {
          cbDate.push(`2018-${month}-${day}`);
          cbValues.push(0)
        } else if(monthValue[i][j][j+1] === 'Sunday') {
          cbDate.push(`2018-${month}-${day}`);
          cbValues.push(null)
        } else if (monthValue[i][j][j+1] !== 'X') {
          cbDate.push(`2018-${month}-${day}`);
          cbValues.push(monthValue[i][j][j+1])
        }
      }
    }

    for (let i = 0; i < cbValues.length; i++) {
        cbRates.push([cbDate[i], cbValues[i], 6]);
    }

    let sql = `INSERT INTO cb_rates (date, value, currency_id) VALUES ?`;
    con.query(sql, [cbRates], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});






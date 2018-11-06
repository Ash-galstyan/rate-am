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

request('http://rate.am/en/armenian-dram-exchange-rates/investment-organizations/non-cash', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table#rb tr');
    let investment_organizations = [];
    let institutions = [];

    trs.find('td.bank a').each(function (i, e) {
      investment_organizations[i] = $(this).text().trim();
    });

    investment_organizations.forEach(investment_organization =>{
      institutions.push([investment_organization, false, false, false, true])
    });

    let sql = `INSERT INTO institutions (name, is_bank, is_exchanges_points, is_credit_organizations, is_investment_organizations) VALUES ?`;
    con.query(sql, [institutions], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});

request('http://rate.am/am/armenian-dram-exchange-rates/credit-organizations/cash', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table#rb tr');
    let credit_organizations = [];
    let institutions = [];

    trs.find('td.bank a').each(function (i, e) {
      credit_organizations[i] = $(this).text().trim();
    });

    credit_organizations.forEach(credit_organization =>{
      institutions.push([credit_organization, false, false, true, false])
    });

    let sql = `INSERT INTO institutions (name, is_bank, is_exchanges_points, is_credit_organizations, is_investment_organizations) VALUES ?`;
    con.query(sql, [institutions], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});

request('https://rate.am/am/armenian-dram-exchange-rates/exchange-points/cash', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table#rb tr');
    let exchanges_points = [];
    let institutions = [];

    trs.find('td.bank a').each(function (i, e) {
      exchanges_points[i] = $(this).text().trim();
    });

    exchanges_points.forEach(exchanges_point =>{
      institutions.push([exchanges_point, false, true, false, false])
    });

    let sql = `INSERT INTO institutions (name, is_bank, is_exchanges_points, is_credit_organizations, is_investment_organizations) VALUES ?`;
    con.query(sql, [institutions], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});

request('https://rate.am', function (error, response, html) {
  if (!error && response.statusCode === 200) {
    let $ = cheerio.load(html);
    let trs = $('table#rb tr');
    let bank = [];
    let institutions = [];

    trs.find('td.bank a').each(function (i, e) {
      bank[i] = $(this).text().trim();
    });

    bank.forEach(bank =>{
      institutions.push([bank, true, false, false, false])
    });

    let sql = `INSERT INTO institutions (name, is_bank, is_exchanges_points, is_credit_organizations, is_investment_organizations) VALUES ?`;
    con.query(sql, [institutions], function (err, result) {
      if (err) throw err;
      console.log("successfully inserted");
    });
  }
});





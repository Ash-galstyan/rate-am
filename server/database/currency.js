const request = require('request');
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql111",
  port: 3306,
  database: "rate"
});

request('https://rate.am', function (error, response) {
  if (!error && response.statusCode === 200) {
    let currencyName = [['USD'], ['EUR'], ['RUR'], ['GBP']];
    con.connect(function (err) {
      if (err) throw err;
        console.log("Connected!");
      let sql = `INSERT INTO currency (name) VALUES ?`;
      con.query(sql, [currencyName], function (err) {
        if (err) throw err;
        console.log("successfully inserted");
      });
    });
  }
});




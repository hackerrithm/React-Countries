const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const mysql = require('mysql')
const cors = require('cors');
const PORT = 3000;

const app = express();



var pool  = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'kemar',
    database: 'countries'
});

/*

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kemar',
    database: 'countries'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.query('SELECT * FROM country', function (err, results) {
  if (err) throw err;
  else {
      console.log(results)
  }
});

connection.end();

*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/countries', function (req, res) {
  pool.getConnection(function (err, db, done) {
    if(err) {
      return res.status(400).send(err);
    } else {
        pool.query('SELECT * FROM country', function (err, results) {
        if (err) {
          throw err;
          res.status(400).send({message: 'Error reading data'});
        } else {
            console.log(results)
            //pool.end();
            res.status(200).send(results);
        }
      });
    }
  });
});

app.delete('/api/remove/:country_name', function (req, res) {
  var country_name = req.params.country_name;
  var c_name = String(country_name);

  console.log("This is here:" + c_name);
  pool.getConnection(function (err, results) {
      pool.query('DELETE FROM country WHERE country_name="'+c_name+'"', function (err, results) {
        if (err) {
          throw err;
          res.status(400).send(err);
        } else {
            console.log(results)
            res.status(200).send({message: 'Data deleted'});
        }
      });
  });
})

app.post('/api/new-country', function(req, res) {
  var country_name = req.body.country_name;
  var continent_name = req.body.continent_name;
  let values = [country_name, continent_name];
  
  pool.getConnection(function (err, results) {
      pool.query('INSERT INTO country (country_name, continent_name) VALUES (?, ?)', [...values], function (err, results) {
        if (err) {
          throw err;
          res.status(400).send({message: 'Error inserting data'});
        } else {
            console.log(results)
            //pool.end();
            res.status(200).send({message: 'Data inserted'});
        }
      });
  });

});


app.listen(PORT, () => console.log('listening on port: '+ PORT));

var express = require('express');
var app = express();
var fs = require("fs");

var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "recipedb"
// });

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// get recipe by id
app.get('/recipe/:id', function(req, res){
    if (con)
    {
        queryStr = "select * from tbl_recipe where id=?";
        con.query(queryStr, [req.params.id], function(err, rows){
            if (err) throw err;
            res.send(JSON.stringify(rows[0]));
        });
    }
});

// get all recipes
app.get('/recipe', function(req, res){
    if (con)
    {
        queryStr = "select * from tbl_recipe";
        con.query(queryStr, function(err, rows){
            if (err) throw err;
            res.send(JSON.stringify(rows));
        });
    }
});

var port = process.env.PORT || 8081;
var server = app.listen(port, function () {
   var host = server.address().address
//    var port = server.address().port
    
   console.log("Example app listening at http://%s:%s", host, port)
})
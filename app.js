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
    host: "us-cdbr-iron-east-03.cleardb.net",
    user: "baa55d5411431a",
    password: "334879d1",
    database: "heroku_45cb0bfd3d23de1"
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


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
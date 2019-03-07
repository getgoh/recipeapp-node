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


  var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };

function handleDisconnect() {
    con = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    con.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();


app.get('/hilove', function(req, res){
  res.send('Hi love');
});

// get recipe by id
app.get('/recipe/:id', function(req, res){
    if (con)
    {
        queryStr = "select * from tbl_recipe where id=?";
        con.query(queryStr, [req.params.id], function(err, rows){
            if (err) throw err;
            res.send(JSON.stringify(rows[0], null, 4));
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
            res.send(JSON.stringify(rows, null, 4));
        });
    }
});

var port = process.env.PORT || 8081;
var server = app.listen(port, function () {
   var host = server.address().address
//    var port = server.address().port
    
   console.log("Example app listening at http://%s:%s", host, port)
})
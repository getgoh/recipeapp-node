var express = require('express');
var app = express();
var fs = require("fs");

var mysql = require('mysql');

// var con = mysql.createConnection({
  
// });


  var db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };

  // var db_config = {
  //   host: "localhost",
  //   user: "root",
  //   password: "password",
  //   database: "recipedb"
  // };

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

            // recipeInfo = {};
            // recipeInfo["recipe"] = rows[0];

            dirsQueryStr = "select * from tbl_directions where recipe_id=?";
            con.query(dirsQueryStr, [req.params.id], function(err, rows2){
              if (err) throw err;
                // recipeInfo["directions"] = rows2[0];
                rows[0]["directions"] = rows2[0];


                // res.send(JSON.stringify(rows[0], null, 4));
                res.send(JSON.stringify(rows[0], null, 4));
            });

            
        });
    }
});

// get all recipes
app.get('/recipe', function(req, res){
    if (con)
    {
        queryStr = "SELECT r.id, r.name, r.description, r.preptime, r.cookingtime, d.id as dir_id, d.recipe_id, d.directions \
                    FROM recipedb.tbl_recipe r \
                    inner join recipedb.tbl_directions d \
                    on r.id = d.recipe_id;";
        con.query(queryStr, function(err, rows){

            var result = [], recipes = {};

            if (err) throw err;

            rows.forEach(function (row) {
              if ( !(row.id in recipes) ) {
                console.log("log");
                recipes[row.id] = {
                      id: row.id,
                      name: row.name,
                      description: row.description,
                      preptime: row.preptime,
                      cookingtime: row.cookingtime,
                      directions: []
                  };
                  result.push(recipes[row.id]);
              }
              recipes[row.id].directions.push({
                  id: row.dir_id,
                  recipe_id: row.recipe_id,
                  directions: row.directions
              });
          });
      
          console.log(result);



            res.send(JSON.stringify(result, null, 4));
        });
    }
});

var port = process.env.PORT || 8081;
var server = app.listen(port, function () {
   var host = server.address().address
//    var port = server.address().port
    
   console.log("Example app listening at http://%s:%s", host, port)
})
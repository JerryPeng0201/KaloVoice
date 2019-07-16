
/*
  Author                      : Jierui Peng
  Date                        : July 1st, 2019
  Voice Application Platform  : Google Home
  Test platform               : Google Dialogflow & Slack
  Database                    : MySQL

  This is the voice application demo. The user can search clothes by giving keywords.
  However, this is just a demo so the user can only search clothes by using color
  as the keyword, and the results have not been processed.
*/

/***********
  Create API Server for Dialogflow
************/
var express = require('express')
var bodyParser = require('body-parser')
var service = express();
var async = require('async');

service.use(bodyParser.json());

var server = service.listen(8081, function() {
  console.log('API Server is Normal!')
})

service.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
  PostgreSQL Database
*/

var pg = require('pg');

var conString = { //Please replace this part to company's database information
  user: "xxx",
  database: "xxx",
  password: "xxx",
  port: 5432
}
var client = new pg.Client(conString);

client.connect(function(error, results){
  if(error){
    console.log('Client COnnection Ready Error: ' + error.message);
    client.end();
    return;
  }
  console.log('Connecting to PostgreSQL ...')
  console.log('Connected to PostgreSQL automatically ...');
  console.log('Connection Success ... \n');

})


function process_request(req, res, next){
  //Default response when the system cannot find the user's color
  //or user gives non-exist intent as a keyword
  res.locals.output_string="Sorry, can't find your coat";
  var r = []

  //Searching the clothes that matches the user's color
  if(req.body.request){ //Recieved the serching request from Google Home
    //req.body.request.intent.name
    if(req.body.request.intent.name == "KaloClothes"){ //The intent category is correct
      console.log("intent is Normal"); //Status report

      //Begin to search the data from PostgreSQL
      selectSQLString = 'SELECT "brand", "color", "category", "title", "description_short" FROM "KaloClothes" WHERE "color"=$1'
      value = [req.body.queryResult.parameters.color]

      console.log("color: " + req.body.queryResult.parameters.color) // parameters check

      //I use async because searching data from the database will cost a long time.
      //async.parallel can gurantee functions are operated at the same time, so it can save some loading time
      async.parallel({
        //data searching function
        brand: function(callback){
          client.query(selectSQLString, value, callback)
          //console.log("callback: " + callback)
        },
        //system status check function
        status_test: function(callback){
          callback(null, "async system normal");
        }
      }, function(err, result){
        //replace the dafault response
        res.locals.output_string = "We found some results: \n"
        for(var i = 0, len = result.brand.rowCount; i < len; i++){
          res.locals.output_string += result.brand.rows[i].title + ", " + result.brand.rows[i].brand + ", " + result.brand.rows[i].category + ", " + result.brand.rows[i].color + ", " + result.brand.rows[i].description_short + "\n"
        }
        next(); //Update the response
      })
      console.log("System Normal") //Status report
    }
  }
}

service.post('/hook', process_request, replyToGoogle); //Connect to Google Home

//Set response of Google Home
function replyToGoogle(req, res){
  return res.json({
    "fulfillmentMessages":[],
    "fulfillmentText": res.locals.output_string,
    "payload":{"slack":{"text":res.locals.output_string}},
    "outputContexts":[],
    "source": "Test Source",
    "followupEventInput": {}
  });
}

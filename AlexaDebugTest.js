var express = require('express');
var bodyParser = require('body-parser');
var util = require("util");
var csv = require("csv");

var service = express();

service.use(bodyParser.json());

var server = service.listen(8081, function(){
  console.log('API server listening ...')
})


service.post('/hook', function (req, res) {
	console.log(req)
  //search_color(req, res)

	return res.json({
                "fulfillmentMessages": [],
                "fulfillmentText": "This is an example response from the webhook.",
                "payload": {},
                "outputContexts": [],
                "source": "Test Source",
                "followupEventInput": {}
            });
})

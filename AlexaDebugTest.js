var express = require('express');
var bodyParser = require('body-parser');
var util = require("util");
//var csv = require("csv");

var service = express();

service.use(bodyParser.json());

var server = service.listen(8081, function(){
  console.log('API server listening ...')
})


service.post('/hook', function (req, res) {
	//console.log(req)
  console.log("\n")
  console.log(req.body.request)

  //search_color(req, res)

	return res.json({
                "version": "beta",
                "sessionAttributes": {
                  "key":"value"
                },
                "response":{
                  "outputSpeech": {
                    "type": "PlainText",
                    "text": "This is demo"
                  },
                  "reprompt": {
                    "outputSpeech": {
                      "type": "PlainText",
                      "text": "Plain text string to speak reprompt"
                    }
                  },
                  "shouldEndSession": true
                }
            });
})

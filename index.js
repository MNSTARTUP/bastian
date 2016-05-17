"use strict"

// Get the modules we need
var restify = require("restify");
var request = require("request");

// YAAY! SERVER!!
var server = restify.createServer();

// Configure the server by adding some plugins
server.use(restify.queryParser());
server.use(restify.bodyParser());

// This is a test endpoint to see if all is going as planned
server.get("/hello/:name",function(req,res,next){
	var text = "Hi, " + (req.params.name || "there!");
	var message = {
		"text" : text
	}
	res.send(message);
	return next();
});

// This is the endpoint which will be called
// When Facebook is trying to verify our bot
server.get("/webhook/",function(req,res,next){
	var token = req.query.hub.verify_token;
	if( token === process.env.VALIDATION_TOKEN ){
		res.write( req.query.hub.challenge );
		res.end();
	}else{
		res.send("Error, wrong validation token");
	}
	return next();

});

// Start the server
// The Heroku environment will be assigning a port number once we deploy
// So we use process.env.PORT for Heroku
// For testing locally, we use port 8080
var port = process.env.PORT || 8080;
server.listen(port,function(){
	console.log('%s listening at %s', server.name, server.url);
});
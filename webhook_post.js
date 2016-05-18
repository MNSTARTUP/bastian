var fb = require("./fb");
var nlp = require("./nlp")
var Q = require("q");

module.exports = function(req, res, next) {
    console.log("===Received a message from FB");
    res.end();
    var entries = req.body.entry;
    var promises = [];
    entries.forEach(function(entry) {
        var messages = entry.messaging;
        messages.forEach(function(message) {
            var senderId = message.sender.id;
            var isTextMessage = message.message.text ? true : false;
            if (isTextMessage) {
                var text = message.message.text;
                console.log("===user sent text");
                // PROMISES
                promises.push(nlp(text, senderId));
            } else {
                fb.reply(fb.textMessage("(y)"), senderId);
            }
        });
    });
    Q.all(promises).then(function(responses) {
        // response is the JSON from API.ai
        responses.forEach(function(response) {
            console.log("===received result from API.ai",response);
            var userSaid = response.result.resolvedQuery;
            console.log("===user sent",userSaid);
            afterNlp(response);
        });
    }, function(error) {
        console.log("[webhook_post.js]", error);
    });
    return next();
}

function afterNlp(data){
    var source = data.result.source;
    var action = data.result.action;
    if(source == "agent"){
        switch( action ){
            case "agent.wo":
                agentwo(data);
                break;
            case "agent.wieviel.oehbeitrag":
            	agentwievieloehbeitrag(data);
            	break;
            default:
                dontKnow(data);
        }
   		// }else if(source == "domains"){
    	//    var simplified = data.result.parameters.simplified;
    	//    if(simplified == "hallo"){
    	//        hello(data);
     	//   }else if(simplified == "wie geht es dir?"){
    	//        howAreYou(data);
    	//    }else{
    	//        dontKnow(data);
    }
    else{
        dontKnow(data);
    }
}

function hello(data){
    var senderId = data.sessionId;
    var message = "Serwas";
    fb.reply(fb.textMessage(message),senderId);
}

function agentwo(data){
    var senderId = data.sessionId;
    var message = "In der Augasse! Einfach beim Haupteingang rein, gleich rechts unter der Stiege durch bis du anstehst. ;)";
    fb.reply(fb.textMessage(message),senderId);
}

function agentwievieloehbeitrag(data){
    var senderId = data.sessionId;
    var message = "Der is grade bei 18,70€.";
    fb.reply(fb.textMessage(message),senderId);
}

function howAreYou(data){
    var senderId = data.sessionId;
    var message = "I'm doing well. Thank you for asking";
    fb.reply(fb.textMessage(message),senderId);
}

function dontKnow(data){
    var senderId = data.sessionId;
    var message = "da bin ich überfragt..";
    fb.reply(fb.textMessage(message),senderId);
}
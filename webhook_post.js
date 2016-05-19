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
    var ort = data.result.parameters.ort;

    if(source == "agent"){
        switch( action ){
            case "agent.wo":
                //agentwo(data);
                switch( ort ){
                	case "öh sekretariat":
                	wosekretariat(data);
                	break;
                	case "gregor-mendel-haus":
                	wogregormendelhaus(data);
                	break;
                default:
                	dontknow(data);
                }
                break;
            case "agent.wieviel.oehbeitrag":
            	agentwievieloehbeitrag(data);
            	break;
            default:
                dontknow(data);
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
        dontknow(data);
    }
}

//Greetings---------------------------------------

function hello(data){
    var senderId = data.sessionId;
    var message = "Serwas";
    fb.reply(fb.textMessage(message),senderId);
}

//Wo Fragen---------------------------------------

function agentwo(data){
    var senderId = data.sessionId;
    var message = "In der Augasse! Einfach beim Haupteingang rein, gleich rechts unter der Stiege durch bis du anstehst. ;)";
    fb.reply(fb.textMessage(message),senderId);
}

function wogregormendelhaus(data){
    var senderId = data.sessionId;
    var message = "Gregor-Mendel-Straße 33, 1180 Wien";
    //sollte über normale google places ersetzt werden
    fb.reply(fb.textMessage(message),senderId);
}

function wosekretariat(data){
    var senderId = data.sessionId;
    var message = "In der Augasse! Einfach beim Haupteingang rein, gleich rechts unter der Stiege durch bis du anstehst. ;)";
    fb.reply(fb.textMessage(message),senderId);
}


//Wieviel Fragen----------------------------------

function agentwievieloehbeitrag(data){
    var senderId = data.sessionId;
    var message = "Der is grade bei 18,70€.";
    fb.reply(fb.textMessage(message),senderId);
}

//Standardantwort---------------------------------

function dontknow(data){
    var senderId = data.sessionId;
    var message = "so is es :)";
    fb.reply(fb.textMessage(message),senderId);
}
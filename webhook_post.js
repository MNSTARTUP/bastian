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
    var qa_data = [ 
                    { q: 'frage1', a: 'antwort1' },
                    { q: 'frage2', a: 'antwort2' },

                ];

    if(source == "agent"){
        for (var i = 0; i < qa_data.length; i++) {
           if(action == qa_data[i].q){
            sendMessage(data, qa_data[i].a)    
           }
        }
    }
    else{
        dontknow(data);
    }
}

//Greetings---------------------------------------

function hello(data){    
    sendMessage(data, "Serwas");
}

//Wo Fragen---------------------------------------

function agentwo(data){
    sendMessage(data, "In der Augasse! Einfach beim Haupteingang rein, gleich rechts unter der Stiege durch bis du anstehst. ;)");
}

function wogregormendelhaus(data){
    sendMessage(data, "Gregor-Mendel-Straße 33, 1180 Wien");
}

function wosekretariat(data){
    sendMessage(data, "In der Augasse! Einfach beim Haupteingang rein, gleich rechts unter der Stiege durch bis du anstehst. ;)");
}

//Wieviel Fragen----------------------------------

function agentwievieloehbeitrag(data){
    sendMessage(data, "Der is grade bei 18,70€.");
}

//Standardantwort---------------------------------

function dontknow(data){
    sendMessage(data, "so is es :)");
}

function sendMessage(data,message){
    var senderId = data.sessionId;
    var message = "so is es :)";
    fb.reply(fb.textMessage(message),senderId);
}

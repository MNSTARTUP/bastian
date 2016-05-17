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
            var userSaid = response.result.resolvedQuery
            console.log("===user sent",userSaid);
            fb.reply( fb.textMessage(userSaid),response.sessionId );
        });
    }, function(error) {
        console.log("[webhook_post.js]", error);
    });
    return next();
}
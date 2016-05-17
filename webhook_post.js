var fb = require("./fb");
module.exports = function(req,res,next){
    console.log("===Received a message from FB");
    // Tell FB that we have received the request by ending it.
    // Without this, the request will timeout and FB will resend it
    // causing you to accidentally spam the user.
    res.end();
    // Get the entries
    var entries = req.body.entry;
    // Let's go over all entries:
    entries.forEach(function(entry){
        var messages = entry.messaging;
        // for every message
        messages.forEach(function(message){
            var senderID = message.sender.id;
            // check if it is a text message
            var isTextMessage = message.message.text ? true : false;
            if( isTextMessage ){
                // echo the text for every message
                var text = message.message.text;
                fb.reply( fb.textMessage(text),senderID );
            }else{
                // else, just send a thumb
                fb.reply( fb.textMessage("(y)"), senderID);
            }
        });
    });
    return next();
}
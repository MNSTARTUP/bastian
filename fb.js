var request = require("request");
var Q = require("q");
//--------------------------------------------------------------------------------
function textMessage(message){
    return {
        "text" : message
    }
}
//--------------------------------------------------------------------------------
function reply(message,senderId){
    var deferred = Q.defer();
    console.log("===sending message to: ",senderId);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token : process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json : {
            recipient: {
                id : senderId
            },
            message : message
        }
    },function(err,response,body) {
        if(err){
            console.log("===error while sending message to FB: ", err.message);
            deferred.reject(err);
        }else{
            if(response.statusCode == 200){
                console.log("===sent message to FB");
                deferred.resolve(body);
            }else{
                deferred.reject(body);
            }
        }
    });
    return deferred.promise;
}
//--------------------------------------------------------------------------------
exports.textMessage = textMessage;
exports.reply = reply;
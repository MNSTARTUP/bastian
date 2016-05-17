module.exports = function(req,res,next){
    console.log("===Received a message from FB");
    // Tell FB that we have received the request by ending it.
    // Without this, the request will timeout and FB will resend it
    // causing you to accidentally spam the user.
    res.end();
    return next();
}
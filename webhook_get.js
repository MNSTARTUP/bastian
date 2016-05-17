module.exports = function(req,res,next){
	var token = req.query.hub.verify_token;
	if( token === process.env.VALIDATION_TOKEN ){
		res.write( req.query.hub.challenge );
		res.end();
	}else{
		res.send("Error, wrong validation token");
	}
	return next();

}
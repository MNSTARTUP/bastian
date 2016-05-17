module.exports = function(req,res,next){
	var text = "Hi, " + (req.params.name || "there!");
	var message = {
		"text" : text
	}
	res.send(message);
	return next();
}

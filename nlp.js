var Q = require("q");
var request = require("request");

function nlp(query,sessionId){
	var deferred = Q.defer();
	var options = {
		"method" : "POST",
		"url" : "https://api.api.ai/v1/query?v=20150910",
		"json" : {
			"query" : query,
			"lang" : "en",
			"sessionId" : sessionId
		},
		"headers" : {
			"Authorization" : "Bearer " + process.env.APIAI_TOKEN,
			"Content-Type" : "application/json"
		}
	};
	
	console.log("===nlp");
	console.log("===query: ",query);
	console.log("===sessionId",sessionId);
	request(options,function(err,response,body){
		if(err){
			console.log("===nlp failed because: ",err.message);
			deferred.reject(err);
		}else{
			body.sessionId = sessionId;
			if(response.statusCode == 200){
				console.log("===nlp succeeded ");
				deferred.resolve(body);
			}else{
				deferred.reject(body);
			}
		}
	});
	return deferred.promise;
}

module.exports = nlp;
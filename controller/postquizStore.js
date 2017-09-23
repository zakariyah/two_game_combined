var postquizsurvey = require('../model/postquizsurvey');
var gameProperties = require('../controller/gameProperties');

var savePostQuiz = function(req)
{
	var informationStore = req.body;	
	informationStore['gameid'] = gameProperties.gameId;
	// console.log(JSON.stringify(informationStore));
	postquizsurvey.createPostQuiz(informationStore);
	
};

module.exports = savePostQuiz;
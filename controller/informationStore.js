var information = require('../model/information');
var gameProperties = require('../controller/gameProperties');

var saveInformation = function(req)
{
	var informationStore = req.body;
	informationStore['gameid'] = gameProperties.gameId;
	information.createInformation(informationStore);
	
};

module.exports = saveInformation;
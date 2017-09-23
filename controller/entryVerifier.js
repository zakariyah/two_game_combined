var enteredGame = require('../model/enteredGame');
var gameProperties = require('../controller/gameProperties');

var entryVerifier = function(req, res, playerPresent, playerAbsent, hiit, gameType)
{
	// verifies entry then save the value : to be used for entry page
	// the player id is not present in the session object
	var hiitNumberInfo = req.body;
	hiitNumberInfo['id'] = hiit;
	hiitNumberInfo['gameid'] = gameProperties.gameId;
	var playerId = hiitNumberInfo['id'];

	enteredGame.findHiitNumberPresentInGame(hiitNumberInfo, function(err, result)
	{
		if(err)
			throw err;
		if(result != null)
		{
			if(result.length == 0)
			{
				req.session.hiitNumber = playerId;
				// console.log('hiitNumber1: ' + playerId);
				enteredGame.createEnteredGame(hiitNumberInfo);
				res.render(playerAbsent, { title: playerAbsent, minTimeMins : 5, maxTimeMins : 20, currency:'AED', reward : 50
		,maxbonus :20, playingtimes : 10, numPlayers : 6, waitingRoomTime : 30000, 
		hiitNumber : playerId, gameTypeId: gameType});
			}
			else
			{
				// console.log('hiitNumber2: ' + playerId);
				res.render(playerPresent, { title: playerPresent, playerIsPresent : 'You are already registered in the system as having participated in the study'});
			}
		}
	});
};
module.exports = entryVerifier;
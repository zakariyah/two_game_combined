var hiitNumber = require('../model/hiitNumber');
var enteredGame = require('../model/enteredGame');
var gameProperties = require('./gameProperties');

var saveHiitNumber = function(req, res, playerPresent, playerAbsent, playerAbsent2, gameStore)
{
	// check player has entered into the entry page before allowing to proceed
	var hiitNumberInfo = req.body;
	hiitNumberInfo['gameid'] = gameProperties.gameId;
	var playerId = hiitNumberInfo['id'];
	var gametype = gameStore.addPlayer(playerId);
	// hiitNumberInfo['gametype'] = gametype;
 	if(gametype != 0)
 	{
 		playerAbsent = playerAbsent2
 	}

	enteredGame.findHiitNumberPresentInGame(hiitNumberInfo, function(err, result)
	{
		if(err)
			throw err;
		if(result != null)
		{
			if(result.length == 0)
			{
				req.session.hiitNumber = playerId;
				console.log('hiitNumber ' + playerId);
				hiitNumber.createHiitSchema(hiitNumberInfo);
				res.render(playerAbsent, { title: 'Entry', minTimeMins : 25, maxTimeMins : 35,
				 currency:'$', reward : '0.50'
		,maxbonus :2.0, playingtimes : 10, numPlayers : 2, waitingRoomTime : 30000});
			}
			else
			{
				res.render(playerPresent, { title: 'Entry', playerIsPresent : 'You are already registered in the system as having participated in the study'});
			}
		}
	});
};
module.exports = saveHiitNumber;
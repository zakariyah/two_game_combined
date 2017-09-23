var moves = require('../model/actionmodel');
var gameProperties = require('../controller/gameProperties');
// needing 2 totalexpectedperround

var calculatePayment = function(req, res)
{
	var hiitInfo = {};
	hiitInfo['gameid'] = gameProperties.gameId;
	var hiitNumber = req.body.playerid;
	hiitInfo['id'] = hiitNumber;
	moves.getMovesFromHiitNumber(hiitInfo, function(err, result)
	{		
		var accruedSum = 0.0;
		var numberOfRandoms = 0;
		var accruedFromRandom = 0.0;
		for(var i in result)
		{
			var move  = result[i];
			if(move.hiitNumber1 == hiitNumber)
			{
				if(move.actiontype != 0)
				{
					accruedSum += move.actionValue;
				}
				else
				{
					// is random
					numberOfRandoms += 1;
					accruedFromRandom += move.actionValue;
				}
			}
			else if(move.hiitNumber2 == hiitNumber)
			{
				if(move.actiontype2 != 0)
				{
					accruedSum += move.actionValue2;
				}
				else
				{
					numberOfRandoms += 1;
					accruedFromRandom += move.actionValue2;
				}
			}
		}

		var cummulativeScore = req.body.cummulativeScore;
		var numberOfRounds = req.body.numberOfRounds;
		var totalExpectedPerRound = 5; // * numberOfRounds;
		if(totalExpectedPerRound != 0)
		{
			// var basePayment = (accruedSum/ totalExpectedPerRound) *0.05;
			var basePayment = (accruedSum) *0.02;
		}
		else
		{
			var basePayment = 0.0;
		}

		if(basePayment < 0.0)
		{
			basePayment = 0.0;
		}
		res.render('postquizsurvey', {title: 'Express', base : basePayment.toFixed(2), numberOfRandoms : numberOfRandoms,
		accruedFromRandom: accruedFromRandom, numberOfRounds : numberOfRounds, cummulativeScore: cummulativeScore});


	});

};

module.exports = calculatePayment;
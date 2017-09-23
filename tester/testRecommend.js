var agen = require('../controller/agent');
var testRecommend = function(secondAgent, numberOfT, probabilityOfAdherance)
{
	// getAgentState
	var numberOfTimes = numberOfT;
	var A  = [2, 2];
	var agent1 = new agen('S++', 0, A, 0.99, false );
	var agent2 = secondAgent;
	var prob = probabilityOfAdherance;
	var numberOfTimes = numberOfT;
	

	var agent1Payoff = 0;
	var agent2Payoff = 0;
	var myM = [];
	myM[0] = [];
	myM[1] = [];
	myM[0][0] = [3, -2];
	myM[0][1] = [5, 0];
	myM[1][0] = [3, 5];
	myM[1][1] = [-2, 0];

	var playersResults = []

	var getPlayerRealChoice = function(rec, probab)
	{
		if(Math.random() < probab)
		{
			return rec;
		}
		else
		{
			return (rec + 1) % 2;
		}
	}

	this.playGame = function()
	{
		// var acts = [];
		for(var i = 0; i < numberOfTimes; i++)
		{
			var rec = agent1.createMove();
			var b = agent2.createMove();
			var recVar = agent1.getAgentState();
			var a = getPlayerRealChoice(rec, prob);
			// acts = [a, b];
			agent1.update([a, b]);
			agent2.update([b, a]);

			var payoff1 = myM[0][a][b];
			var payoff2 = myM[1][a][b];
			agent1Payoff += payoff1
			agent2Payoff += payoff2
			playersResults.push([a,b, payoff1, payoff2,rec, recVar])
		}


		return playersResults
	}
}

module.exports = testRecommend;
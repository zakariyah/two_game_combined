var StateOfAgent = function(jefePlusPlus)
{
	// This class tries to get the state of the agent at any given point.
	// It tries to answer some specific questions.
	// ********** Why did it suggest a given option
	// ********** Wh
	// ********** Wh
	// ********** Wh
	// ********** Wh
	// ********** Wh
	var myJefePlusPlus = jefePlusPlus;

	this.getLatestChoice = function()
	{
		return myJefePlusPlus.latestChoice;
	}

	var reciprocity, niceness, bully;

	this.getOpponentState = function()
	{
		this.calculateOpponentState();
		return [reciprocity, niceness, bully];
	}

	this.calculateOpponentState = function()
	{
		var history = jefePlusPlus.gameHistory;
		if(history.length == 0)
		{
			return;
		}
		var rec = 0;
		var nice = history[0][1] == 1;
		var bul = 0;
		for(var i = 0; i < history.length; i++)
		{
			if(i != 0)
			{
				if(history[i][1] == history[i-1][0])
				{
					rec += 1;
				}	
			}

			if(history[i][0] == 0 && history[i][1] == 1)
			{
				bul += 1;
			}
		}

		reciprocity = rec / history.length * 100;
		bully = bul / history.length * 100;
		niceness = nice;
		reciprocity = reciprocity.toFixed(2);
		bully = bully.toFixed(2);
	}

	this.getAgentVariables = function()
	{
		return myJefePlusPlus.getAgentVariables();
	}

	this.getAgentState = function()
	{
		var opponentState = this.getOpponentState();
		var agentVar = this.getAgentVariables();
		var agentChoice = this.getLatestChoice();
		return {opponentState : opponentState, agentVar : agentVar, agentChoice : agentChoice};
	}

}

module.exports = StateOfAgent;
//  get the states to the user interface
// think about solving the rest
// talk to Jacob about the solution
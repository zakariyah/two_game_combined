function gameplayer(id, socket, isAgent, index) // index can take one or two
{	
	if(isAgent)
	{
		this.id = id;	
	}
	else
	{
		this.id = socket.id;
	}
	
	this.isRandom = false;	
	this.latestRecommendation = -1;
	this.timeOfAction = -1;
	
	this.isAgent = isAgent;
	this.recommender;
	this.hasRecommender  = false;

	this.setHasRecommender = function(isRandomValue)
	{
		this.isRandom = isRandomValue;
		var agen  = require('./agent.js');
		var A  = [2, 2];
		this.recommender = new agen('S++', 0, A, 0.99, this.isRandom);	
		this.hasRecommender = true;
	}

	this.getRecommendation = function()
	{
		if(this.hasRecommender)
		{
			var agentMove = this.recommender.createMove();
			this.latestRecommendation = agentMove + 1;
			return agentMove + 1; // 1 added to tally with the game settings. 1 for cooperate and 2 for defect
		}
		return null;
	}

	this.getLatestRecommendation = function()
	{
		return this.latestRecommendation;
	}

	this.getTimeOfAction = function()
	{
		return this.timeOfAction;
	}

	this.setTimeOfAction = function(timeT)
	{
		this.timeOfAction = timeT;
	}

	this.updateRecommender = function(playerMove, opponentMove)
	{
		if(this.hasRecommender)
		{
			var acts = [playerMove - 1, opponentMove - 1];
			this.recommender.update(acts);
		}
	}

	if(isAgent)
	{
		var agen  = require('./agent.js');
		var A  = [2, 2];
		this.agent = new agen('S++', (index - 1), A, 0.99);
	}

	this.setSocket = function(sessionSocket)
	{
		this.sessionSocket = sessionSocket;
	}

	this.sessionSocket = socket;

	this.setOpponentId = function(id)
	{
		this.opponentId = id;
	}

	this.nextMove = function(opponentMove)
	{
		// this is called to return the next move if it is an agrnt playing
		if(isAgent)
		{
			var agentMove = this.agent.createMove();
			var acts = [agentMove, opponentMove - 1];
			this.agent.update(acts);
			return agentMove + 1;
		}
		return null;
	}

	this.gameStore = [];
}

module.exports = gameplayer;
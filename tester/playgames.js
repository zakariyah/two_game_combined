var playgames = function(agent1, agent2, numberOfTimes)
{
	this.numberOfTimes = numberOfTimes;
	this.agent1 = agent1;
	this.agent2 = agent2;
	// this.agent1choices = [];
	// this.agent2choices = [];
	this.agent1Payoff = 0;
	this.agent2Payoff = 0;
	this.myM = [];
	this.myM[0] = [];
	this.myM[1] = [];
	this.myM[0][0] = [0.6, 0];
	this.myM[0][1] = [1, 0.2];
	this.myM[1][0] = [0.6, 1];
	this.myM[1][1] = [0, 0.2];
	this.playGame = function()
	{
		// var acts = [];
		for(var i = 0; i < this.numberOfTimes; i++)
		{
			var a = this.agent1.createMove();
			var b = this.agent2.createMove();
			// acts = [a, b];
			this.agent1.update([a, b]);
			this.agent2.update([b, a]);
			// this.agent1choices.push(a);
			// this.agent2choices.push(b);
			console.log("agent "  + [a, b]);
			this.agent1Payoff += this.myM[0][a][b];
			this.agent2Payoff += this.myM[1][a][b];
		}

		return [this.agent1Payoff, this.agent2Payoff];
	}
}

module.exports = playgames;
var randAgent = function()
{
	this.moves = [];
	this.opponentMoves = [];
	this.round = 0;
	
	this.createMove = function()
	{	
		this.round ++;
		return Math.floor(Math.random() * 2);
	}

	this.update = function(acts)
	{
		// console.log("was called");
		// this.opponentMoves.push(acts[1]);
	}
}

module.exports = randAgent;
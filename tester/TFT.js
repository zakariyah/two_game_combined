var TFT = function()
{
	this.moves = [];
	this.opponentMoves = [];
	this.round = 0;
	this.createMove = function()
	{

		if(this.round == 0)
		{
			// console.log("was called" + this.round);
			this.round ++;
			return 0;
		}
		else
		{
			// console.log(this.opponentMoves);
			a = this.opponentMoves.pop();
			// console.log(a);
			this.round ++;
			return a;
		}
		// return 0;
		
	}

	this.update = function(acts)
	{
		// console.log("was called");
		thise.opponentMoves.push(acts[1]);
	}

}

module.exports = TFT;
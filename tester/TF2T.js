var TF2T = function()
{
	this.moves = [];
	this.opponentMoves = [];
	this.round = 0;
	this.createMove = function()
	{

		if(this.round == 0 || this.round == 1)
		{
			// console.log("was called" + this.round);
			this.round ++;
			return 0;
		}
		else
		{	
			this.round ++;
			// console.log(this.opponentMoves);
			var leng = this.opponentMoves.length;
			if(this.opponentMoves[leng - 1] == 1 && this.opponentMoves[leng -2] == 1)
			{
				return 1
			}
			return 0;
		}
		// return 0;
		
	}

	this.update = function(acts)
	{
		// console.log("was called");
		this.opponentMoves.push(acts[1]);
	}

}

module.exports = TF2T;
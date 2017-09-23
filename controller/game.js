function game(gameName, optionsAndValue) // give the matrix as a 4 by 4 array e.g (A, B, 1, 5)
//the matrix is called pdGameMatrix
{
	this.choices  = ['A', 'B'];
	this.gameName = gameName;
	this.optionsAndValue = optionsAndValue;
	// console.log(optionsAndValue);
	// console.log(gameName);
	this.options = {};
	for(var i = 0; i < this.optionsAndValue.length; i++)
	{
		// console.log("option " + this.optionsAndValue[i][0]);
		option = (this.optionsAndValue[i][0] + "" +  this.optionsAndValue[i][1]);
		valueGiven = [this.optionsAndValue[i][2], this.optionsAndValue[i][3]];
		this.options[option] = valueGiven;
		// console.log( this.options);
	}
	this.getPlayerPayoff = function(optionChosen, playerNumber)
	{
		optionChosen = (this.choices[optionChosen[0] - 1] + "" +  this.choices[optionChosen[1] -1]);
		if(playerNumber == 2)
		{
			// console.log('here');
			optionChosen =  optionChosen.split("").reverse().join("");
		}
		// console.log(optionChosen);
		values = this.options[optionChosen];
		// console.log(values);
		// console.log(this.options);
		if(values)
		return values[0];
		else
		return -1;
	}
};

// newgame = new game('second', [['A', 'B', 0, 5], ['B', 'A', 5, 0], ['A', 'A', 3, 3], ['B', 'B', 1, 1]]);
// console.log(newgame.getPlayerPayoff(([1,2]), 2));
module.exports = game;
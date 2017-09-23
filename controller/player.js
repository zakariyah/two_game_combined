function player(id)
{
	this.id = id;
	this.gameChoices = ["A", "B"];
	this.connected = true;
	this.history = [];
	this.addToHistory =  function(arrayOfValues){
		this.history.push(arrayOfValues) //[choice, value, opponentchoice, opponentvalue]);
		// console.log("after pushing: " + JSON.stringify(this.history));
	};

	var gameProperties = require('../controller/gameProperties');
	var gameMatrix = gameProperties.pdGameMatrix;
	this.getCummulativeValue = function()
	{
		cummulative = 0;
		for(var i = 0; i < this.history.length; i++)
		{
			cummulative += this.history[i][1];
		}
		return cummulative;
	};

	this.getOpponentCummulativeValue = function()
	{
		cummulative = 0;
		for(var i = 0; i < this.history.length; i++)
		{
			cummulative += this.history[i][3];
		}
		return cummulative;
	};

	this.printResults = function()
	{
	var color1 = " label-danger";
	html = "<table class=\"table table-bordered\"><tr><td>Round</td><td>Your Choice </td> <td>Agent Choice </td> <td> Your score </td></tr>";
		html += " <tr><td colspan=3> <h3><span class=\"label label-primary\">CUMMULATIVE SCORE </span></h3></td><td>" +
		"<h3><span class=\"label " + color1 + "\">" + this.getCummulativeValue() +
		        "</span></h3></td></tr>";
		// console.log("len: " + this.history.length);
		var randomBadge = "<span class=\"badge  pull-right\">R</span>";
		var color1 = (this.getCummulativeValue() > this.getOpponentCummulativeValue()) ? " label-info " : " label-danger";
		var color2 = (this.getCummulativeValue() < this.getOpponentCummulativeValue()) ? " label-info " : " label-danger";
		toBeAddedAll = "";
		for(var i = 0; i < this.history.length; i++)
		{
			toBeAdded = " <tr><td>"+ (i + 1) + "</td><td>" + this.gameChoices[this.history[i][0] - 1] + " " +
				((this.history[i][4] == 0) ? randomBadge : "") +
			"</td><td>" + this.gameChoices[this.history[i][2] - 1] + " " +
			((this.history[i][5] == 0) ? "" : "") +	
			"</td><td>" + this.history[i][1] + "</td></tr>";			
			toBeAddedAll = toBeAdded + toBeAddedAll;
		}
		html += toBeAddedAll;
		html += "</table>";
		// gameProperties.gameMatrix = [[-2, 5], [0, 0]];
		// [['A', 'B', 0, 5], ['B', 'A', 5, 0], ['A', 'A', 3, 3], ['B', 'B', 1, 1]];
		var briefAnswer = "";
		var lastIndex = this.history.length - 1;
		var playerChoiceNum = this.history[lastIndex][0] - 1;
		var opponentChoiceNum = this.history[lastIndex][2] - 1;
		// console.log("opponent choice num " + opponentChoiceNum);
		// console.log("game matrix " + gameMatrix);


		var playerChoice = this.gameChoices[playerChoiceNum];
		var opponentChoice = this.gameChoices[opponentChoiceNum];
		var playerGotFromItself = gameMatrix[this.history[lastIndex][0] - 1][0];
		var playerGotFromOpponent = gameMatrix[this.history[lastIndex][2] - 1][1];
		var val = 2 * playerChoiceNum + opponentChoiceNum;
		var total = gameMatrix[val][2] ;  //playerGotFromItself + playerGotFromOpponent;
		var totalOpponent = gameMatrix[val][3];
		var playerChoiceWasRandom = (this.history[lastIndex][4] == 0);

		// new value to be sent
		var briefInfo = {playerChoiceInNumber : this.history[lastIndex][0], opponentChoiceInNumber : this.history[lastIndex][2], fromItself: playerGotFromItself, fromOpponent: playerGotFromOpponent, isRandom : playerChoiceWasRandom, total : total, totalOpponent: totalOpponent};
		return  briefInfo;
	};
}

module.exports = player;
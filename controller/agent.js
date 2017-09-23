// This class creates the called agent and supply it with it needed characters. It also helps store the 
// state of the game for the agent. It is what defines the agent next move.


var agent = function(nombre, playerIndex, payOffMatrix, lambda, isRandom) // nombre, _me, _A[2], _M, _lambda, _game[1024]
{
	

	this.payOffMatrix =  payOffMatrix;
	this.isRandom = isRandom;
	var round = 0;

	this.buildPayoffMatrix = function()
	{
		// try and get what M is and use it to build this.
		var myM = [];
		myM[0] = [];
		myM[1] = [];
		// myM[0][0] = [0.6, 0];
		// myM[0][1] = [1, 0.2];
		// myM[1][0] = [0.6, 1];
		// myM[1][1] = [0, 0.2];

		//  for new matrix
		myM[0][0] = [0.6, -0.4];
		myM[0][1] = [1, 0.0];
		myM[1][0] = [0.6, 1];
		myM[1][1] = [-0.4, 0.0];
		return myM;
	}
	
	this.M = this.buildPayoffMatrix();


	var jefe_plus  = require('../hagent/jefe_plus.js');
	// var agentState  = require('../hagent/stateOfAgent.js');
	var ViewOnGame = require('./recommenderViewOnGame.js');


	this.myJefePlus = new jefe_plus(nombre, playerIndex, payOffMatrix, this.M,  lambda); // get those variables
	// this.myAgentState = new agentState(this.myJefePlus);
	this.viewOfGame = new ViewOnGame(this.myJefePlus);

	this.createMove = function()
	{ 
		round += 1;
		if(this.isRandom)
		{
			return Math.floor((Math.random() + 0.5));
		}
		return this.myJefePlus.move(); // returns 0 for cooperate and 1 for defect
	}	

	this.update = function(acts)
	{
		// This is to be called after the createMove.
		// acts is an array with the first element the agent's move and the second element
		// its opponent move.
		this.myJefePlus.update(acts);
	}

	this.getAgentState = function()
	{
		// the method is to print out the user state.
		return this.viewOfGame.getSolutionForRound();
	}

	this.getRecommender = function()
	{
		return this.myJefePlus;
	}
	// this.getAgentVariables = function()
	// {
	// 	return this.myJefePlus.getAgentVariables();
	// }

}

module.exports = agent;
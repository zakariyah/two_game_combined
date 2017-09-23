var moves = require('../model/actionmodel');

var answerSlot = function(player1, opponent, answer1, opponentAnswer, round)
{
	this.player1 = player1;
	this.opponent = opponent;
	this.answer1 = answer1;
	this.round = round;
	// this.gameid = gameid;
	this.opponentAnswer = opponentAnswer;
	this.player1Type = "Normal";
	
	if(answer1 == 0)
	{
		this.player1Type = "Random";
	}
	
	this.player2Type = "Normal";
	
	if(opponentAnswer == 0)
	{
		this.opponentAnswer = "Random";
	}


	move = {gameid : this.gameid, round : this.round, playerid : player1.id,
                action : answer1, actionValue : player1Value, 
                playerid2 : opponent.id, action2 : opponentAnswer, 
                actionValue2 : player2Value, actiontype: player1Type
                , actiontype2: player2Type};
    moves.createMove(move);             

}
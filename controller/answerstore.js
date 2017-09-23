// needing
var moves = require('../model/actionmodel');
var game = require('./game');
var player = require('./player');
var answerContainer = require('./answer.js');
var gameProperties = require('./gameProperties');
newgame = new game(gameProperties.gameId, gameProperties.pdGameMatrix);

function answerstore(numberOfAnswers) {
    this.numberOfAnswers = numberOfAnswers;
    this.gameid = newgame.gameName;
    this.answerers = []; // not representative of the answer set
    this.answererSet = {};
    this.round = 1;
    this.players = {};
    this.answererObjects = {};
    this.addAnswer = function(answer, answererObject) { // pass in answer and answerer as gameplayerobject
        var answerer = answererObject.id;        
    	if(!(answerer in this.answererSet))
    	 {
    	 this.answerers.push(answerer);
    	 this.answererSet[answerer] = new answerContainer(answer);
         this.answererObjects[answerer] = answererObject;
         if(this.round == 1)
        {
            this.players[answerer] = new player(answerer);
        }
    	}
        else
        {
        this.answererSet[answerer] = new answerContainer(answer);   
        }
        this.addToPlayerHistory();
        
        if(this.isFilled() == false)
        {
            var status = this.opponentIsDisconnected(answerer);
            // console.log("status of opponent " + status);
            if(status != false)
            {   
                this.answerers.push(status);
                this.answererSet[status] = new answerContainer(0);
                this.addToPlayerHistory();
            }
        }
    };

    this.opponentIsDisconnected = function(answerer)
    {
        var opponent = false;
        for(play in this.players)
        {
            if(play != answerer)
            {
                opponent = play;
                break;
            }
        }
        if(!opponent)
        {
            // console.log("h123")
            return false;
        }
        if(this.players[opponent].connected)
        {
            // console.log("h322");
            return false;
        }
        return opponent;
    };


    this.setPlayerConnectedStatusToFalse = function(answerer)
    {
        console.log('answerer is: ' + answerer);
        this.players[answerer].connected = false;
    };

    this.isFilled = function(){
    	return this.answerers.length == this.numberOfAnswers;
    };

    this.addToPlayerHistory = function()
    {
        if(this.isFilled())
        {

            this.answerers = this.answerers.sort(); //to maintain position
            player1id = this.answerers[0];
            player2id = this.answerers[1];
            player1Choice = this.answererSet[player1id].chosenAnswer;
            player2Choice = this.answererSet[player2id].chosenAnswer;
            player1Type = this.answererSet[player1id].answerType;
            player2Type = this.answererSet[player2id].answerType;
            player1Value = newgame.getPlayerPayoff([player1Choice, player2Choice], 1);
            player2Value = newgame.getPlayerPayoff([player1Choice, player2Choice], 2);
            
            // newly added values
            player1Object = this.answererObjects[player1id];
            player2Object = this.answererObjects[player2id];
            player1HiitNumber = player1Object.hiitNumber;
            player2HiitNumber = player2Object.hiitNumber;
            hasRecommenderValue  = player1Object.hasRecommender ? "yes" : "no";
            hasRecommender2Value  = player2Object.hasRecommender ? "yes" : "no"; 
            recommendedActionValue = player1Object.getLatestRecommendation();
            recommendedAction2Value = player2Object.getLatestRecommendation();
            timeOfActionValue = player1Object.getTimeOfAction();
            timeOfAction2Value = player2Object.getTimeOfAction();
            isAgentValue = player1Object.isAgent ? "yes" : "no";
            isAgent2Value = player2Object.isAgent ? "yes" : "no";
            recommendertype = player1Object.getRecommenderType();
            recommendertype2 = player2Object.getRecommenderType();
            // console.log("na object " + this.players[player1id].id);
            this.players[player1id].addToHistory([player1Choice, player1Value, player2Choice,player2Value, player1Type, player2Type]);
            this.players[player2id].addToHistory([player2Choice, player2Value, player1Choice,player1Value, player2Type, player1Type]);
             //database savings
                move = {gameid : this.gameid, round : this.round, playerid : player1id,
                action : player1Choice, actionValue : player1Value, 
                playerid2 : player2id,
                action2 : player2Choice, actionValue2 : player2Value, actiontype: player1Type
                , actiontype2: player2Type, hasRecommender : hasRecommenderValue, hasRecommender2 : hasRecommender2Value,
                recommendedAction : recommendedActionValue, recommendedAction2 : recommendedAction2Value,
                timeOfAction : timeOfActionValue, timeOfAction2 : timeOfAction2Value, isAgent : isAgentValue, isAgent2 : isAgent2Value, hiitNumber1 : player1HiitNumber,
                hiitNumber2 : player2HiitNumber, recommendertype : recommendertype, recommendertype2 : recommendertype2 };
                moves.createMove(move);             
        }
    }

    this.clear = function()
    {
        this.answerers = [];
    	this.answererSet = [];
        this.round ++;
    };
}

module.exports = answerstore;
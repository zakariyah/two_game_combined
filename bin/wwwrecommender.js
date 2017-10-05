#!/usr/bin/env node
var debug = require('debug')('my-application');
//var connect = require('connect');
// var restler = require('restler');
var app = require('../app');
var io = require('socket.io');
// var cookieParser = require('cookie-parser');
var connecter = require('../database');
connecter('mongodb://127.0.0.1/experimentdbtest');
var SessionSockets = require('session.socket.io');
var gameController = require('../controller/gameController');
var gameplayer = require('../controller/gameplayer');
var gameProperties = require('../controller/gameProperties');
var gameTypeStore = require('../controller/gameTypeStore');
var gameControllerArray = require('../controller/gameControllerArray');


// for testing
var TFT = require('../tester/TFT');
var TF2T = require('../tester/TF2T');
var AC = require('../tester/AlwaysCooperate');
var AD = require('../tester/AlwaysDefect');
var randAgent = require('../tester/randAgent');
var playgames = require('../tester/playgames');
var testRecommend = require('../tester/testRecommend');
// end testing

var playerHiitNumberMap = {};

app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  
});
var ionew = io.listen(server);

sessionSockets = new SessionSockets(ionew, app.sessionstore, app.cookieNew);

var gamecontroller = new gameController(2);
var gameMap = {};
var gameStartStatus = false;
// var answerStores = {};
var numberOfGameControllers = 200;
var gameControllerArray = new gameControllerArray();
var numberOfPairs = 0;
var gameCounter = 0;
var firstPlayerJustEntered = true;
var playersSocketDict = {};
var playerGameType = {};
var gameTypeStore = new gameTypeStore();


var gameTypes = gameProperties.gameTypes; 
ionew.sockets.on('connection', function (socket) {

	socket.on('waitingTimeElapsed', function()
	{
	
			if(!(socket.id in gameMap)) // if player has not been already mapped
			{
	
				var player = new gameplayer(socket.id + "agent", null, true, 1, null); //agents dont have socket
				var soc_game_controller = gameControllerArray.getController(socket.id);
				if(typeof soc_game_controller === 'undefined')
				{
					return;  // what should be done
				}
				soc_game_controller.addPlayer(player);				
				if(soc_game_controller.isFilled())
				{
					startGame(soc_game_controller);

					var playersId = Object.keys(soc_game_controller.gamePlayers);
					// for(playerId in playersId)
					// {
					// 	var playerObject = gameControllerArray[gameCounter].gamePlayers[playersId[playerId]];
					// 	if(!playerObject.isAgent)
					// 	{ // only the non agent gets the recommendation
					// 		// not needed for first game
					// 		// playerObject.setHasRecommender(false);
					// 	}						
					// }

					firstPlayerJustEntered = true;
					sendMessageAndStart(soc_game_controller);
				}
				else
				{
					firstPlayerJustEntered = false;
				}
				gameCounter += 1;
			}
			
	});

	socket.on('join', function(joinInfo)
	{
		// 1. implememnt the assigning of partners
		// 2. Tackle cases of elapsing waiting time
		// 3. Implement monitoring page
		// 4. Upload to Amazon
		// 5. send mail to Ummu Khuweila
		var hiitNumber = joinInfo.hiitNumber;
		var gametypeIdVal = joinInfo.gametypeIdVal;
		// console.log("start game results " + gametypeIdVal + "  " + hiitNumber);


		var start_game_results = gameTypeStore.addPlayer(hiitNumber, gametypeIdVal);
		// console.log("start game results " + start_game_results);
		var game_controller = gameControllerArray.addPlayer(start_game_results, socket.id, hiitNumber);
		
		// if(firstPlayerJustEntered)
		// {
		// 	gameControllerArray[gameCounter] = new gameController(2);
		// }
		// else
		// {

		// }
		playerHiitNumberMap[socket.id] = hiitNumber; // mapping socketid to hiitNumber.

		// get Game type
		var gameTypeIndex = gameCounter % gameTypes.length;
		var presentGameType = gameTypes[gameTypeIndex];
		startGameTypeForTheNextTwoPlayers(presentGameType, game_controller, start_game_results, hiitNumber);		
	});

	function startGameTypeForTheNextTwoPlayers(gameType, game_controller, start_game_results,hiitNumber )
	{
		// if normal
		if(gameType == 'normal')
		{
			// console.log('here normal');
			var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
			// gameControllerArray[gameCounter].addPlayer(player);
			
			game_controller.addPlayer(player);
			
			if(start_game_results.gameType == 'single' && start_game_results.start_game)
			{
				var agent_player = new gameplayer(hiitNumber + "agent", null, true, 1, null); //agents dont have socket
				// console.log("Agent was added *******************");
				game_controller.addPlayer(agent_player);
			}

			// console.log("Game controller is filled " + game_controller.isFilled());
			if(game_controller.isFilled())
			{
				startGame(game_controller);
				// firstPlayerJustEntered = true;
			}
			else
			{
				// firstPlayerJustEntered = false;
			}
		}
		// else if(gameType == "randomRecommenders")
		// {
			
		// 	var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
		// 	gameControllerArray[gameCounter].addPlayer(player);
		// 	if(gameControllerArray[gameCounter].isFilled())
		// 	{
		// 		startGame();
		// 		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				
				
		// 		for(var playerId in playersId)
		// 		{
					
		// 			gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
		// 		}
				
		// 		firstPlayerJustEntered = true;
		// 	}
		// 	else
		// 	{
		// 		firstPlayerJustEntered = false;
		// 	}
		// } 
		// else if(gameType == "realRecommenders")
		// {
			
		// 	var player = new gameplayer(gameCounter, socket, false, 1,playerHiitNumberMap[socket.id]);
		// 	gameControllerArray[gameCounter].addPlayer(player);
		// 	if(gameControllerArray[gameCounter].isFilled())
		// 	{
		// 		startGame();
		// 		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
		// 		for(playerId in playersId)
		// 		{
		// 			gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
		// 		}
				
		// 		firstPlayerJustEntered = true;
		// 	}
		// 	else
		// 	{
		// 		firstPlayerJustEntered = false;
		// 	}
		// }
		// else if(gameType == "oneRealRecommender")
		// {
			
		// 	var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
		// 	gameControllerArray[gameCounter].addPlayer(player);
		// 	if(gameControllerArray[gameCounter].isFilled())
		// 	{
		// 		startGame();
		// 		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
		// 		for(playerId in playersId)
		// 		{
		// 			gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
		// 			break;  // to make sure only one has a recommender
		// 		}
				
		// 		firstPlayerJustEntered = true;
		// 	}
		// 	else
		// 	{
		// 		firstPlayerJustEntered = false;
		// 	}
		// }

		// else if(gameType == "oneRandomRecommender")
		// {
			
		// 	var player = new gameplayer(gameCounter, socket, false, 1, playerHiitNumberMap[socket.id]);
		// 	gameControllerArray[gameCounter].addPlayer(player);
		// 	if(gameControllerArray[gameCounter].isFilled())
		// 	{
		// 		startGame();
		// 		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
		// 		for(playerId in playersId)
		// 		{
		// 			gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
		// 			break;  // to make sure only one has a recommender
		// 		}				
		// 		firstPlayerJustEntered = true;
		// 	}
		// 	else
		// 	{
		// 		firstPlayerJustEntered = false;
		// 	}
		// }
		
		playersSocketDict[socket.id] = gameCounter; // dictionary to be used for getting players later on

		if(game_controller.isFilled())
		{
			sendMessageAndStart(game_controller);
			gameCounter += 1;		
		}

	}

	function startGame(game_controller)
	{
	
		var playersId = Object.keys(game_controller.gamePlayers); // createAgentToBeAddedToRooms();

// 		if(!gameStartStatus)
// 		{
			// console.log("players id is " + playersId);
			mapOutPlayers(playersId, game_controller);
			// gameCounter += 1;
	}

	function sendMessageAndStart(game_controller)
	{
		// console.log('game started ');
		for(var i in game_controller.gamePlayers)
			{
				
				var message = "Your opponent's id is " + gameMap[i];
				if( !game_controller.gamePlayers[i].isAgent)
				{
					if(game_controller.gamePlayers[i].hasRecommender)
					{
						message += " But don't worry, you have a recommender ";
					}
						var playerToSendMessage = game_controller.gamePlayers[i];
						var roomObject = game_controller.gameRooms[playerToSendMessage.id]; 
						var numberOfRounds = roomObject.getGameRounds();
						
						var recommenderOption = playerToSendMessage.hasRecommender ? 1 : 0;
						var recc = playerToSendMessage.getRecommendation();
						var agentState = playerToSendMessage.getRecommenderVariables();
						playerToSendMessage.sessionSocket.emit('serverMessage', {count : 0, text : message, rounds : numberOfRounds, recommenderOptionValue : recommenderOption, recommendation : recc, agentState : agentState});
						playerToSendMessage.sessionSocket.emit('start');
						// console.log('server message and start emmited');
				}
			}
	}

		function mapOutPlayers(playersId, game_controller)
	{
		
		
		for (var i = 0; i < playersId.length; i++)
		{
			var playerId = playersId[i];
			if(i % 2 == 0)
			{
				gameMap[playerId] = playersId[i + 1]
				game_controller.setPlayersToRoom(playerId, playersId[i + 1] );
			}	
			else
			{
				gameMap[playerId] = playersId[i - 1];
				game_controller.pointSecondPlayerToRoom(playerId, playersId[i - 1], Math.floor(i/2));
			}
		};
	} 


	socket.on('clientMessage', function(content) {
		var options = ['A', 'B'];
		
		// var presentSocketGameCounter = playersSocketDict[socket.id];
		// if(typeof presentSocketGameCounter === 'undefined')
		// {
		// 	return;
		// }
		var soc_game_controller = gameControllerArray.getController(socket.id);

		roomNumber =  soc_game_controller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
		store = soc_game_controller.answerStores[roomNumber];


	if(store)
	{
		var roomObject = soc_game_controller.gameRooms[socket.id]; 
		store.addAnswer(content.gamePlay, soc_game_controller.gamePlayers[socket.id]);
		soc_game_controller.gamePlayers[socket.id].setTimeOfAction(content.timeOfAction);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";

		if(roomObject.agentPresent)  //if agent is present in the game
		{
			var opponent = gameMap[socket.id];  //get agent id.
			// var agentMove = roomObject.player2.nextMove(content.gamePlay); // error code

			var contentOfHumanAnswer = store.answererSet[socket.id].chosenAnswer
			// console.log("contentOfHumanAnswer move " + contentOfHumanAnswer);

			var agentMove = roomObject.player2.nextMove(contentOfHumanAnswer);
			
			// console.log("agent move " + agentMove  + ': opponent ' + opponent);

			store.addAnswer(agentMove, soc_game_controller.gamePlayers[opponent]);
			
			// to be removed after test
			// to update the recommender
			var soc1 = roomObject.player1;
			var soc2 = roomObject.player2;
			var soc1Answer = store.answererSet[soc1.id].chosenAnswer;
			var soc2Answer = store.answererSet[soc2.id].chosenAnswer
			// how do I know I am first and agent is second
			soc1.updateRecommender(soc1Answer, soc2Answer);
			// end of to be removed

			var recc = soc_game_controller.gamePlayers[socket.id].getRecommendation();
			var cummScore = store.players[socket.id].getCummulativeValue();
			var agentState = roomObject.player1.getRecommenderVariables();
			// console.log('agent state is ' + JSON.stringify(agentState));
			var message = {count : store.round, text : store.players[socket.id].printResults(), 
				recommendation : recc, rounds : roomObject.getGameRounds(), cumm: cummScore, 
				agentState: agentState};
			
			
			socket.emit('serverMessage', message);
			store.clear();
		}

		else // if agent is not present
		{
			if(store.isFilled())
			{					
				
				var soc1 = roomObject.player1;
				var soc2 = roomObject.player2;
				if(!soc1.isAgent)
				{ 
					// returns null if it has no recommender and also does nothing in update recommender
					soc1.updateRecommender(store.answererSet[soc1.id].chosenAnswer, store.answererSet[soc2.id].chosenAnswer);
					var cummScore = store.players[soc1.id].getCummulativeValue();
					var recommendedValue = soc1.getRecommendation();
					var agentState = soc1.getRecommenderVariables(); // recommender variables should be after the move
					var message = {count : store.round, text : store.players[soc1.id].printResults(), recommendation : recommendedValue , rounds : roomObject.getGameRounds(), cumm : cummScore, agentState: agentState};
					soc1.sessionSocket.emit('serverMessage', message);						
				}
				else
				{
					// take care of agents !!!	 already taken care of. Just trying to play safe
				}

				if(!soc2.isAgent)
				{
					
					soc2.updateRecommender(store.answererSet[soc2.id].chosenAnswer, store.answererSet[soc1.id].chosenAnswer);
					var cummScore = store.players[soc2.id].getCummulativeValue();
					
					var recommendedValue = soc2.getRecommendation();
					var agentState = soc2.getRecommenderVariables(); // recommender variables should be after move
					var message2 = {count : store.round, text : store.players[soc2.id].printResults(), recommendation : recommendedValue, rounds : roomObject.getGameRounds(), cumm :cummScore, agentState: agentState};
					soc2.sessionSocket.emit('serverMessage', message2);						
				}
				else
				{
					// take care of agents !!!
				}
				store.clear();
			}	
		}
		
	}
});


socket.on('disconnect', function()
{
	
	// var presentSocketGameCounter = playersSocketDict[socket.id];
	// 	if(typeof presentSocketGameCounter === 'undefined')
	// 	{
	// 		return;
	// 	}
	// 	else if(typeof gameControllerArray[presentSocketGameCounter] === "undefined")
	// 	{
	// 		// a case where a previous game sends an disconnect message
	// 		return;
	// 	}

	var soc_game_controller = gameControllerArray.getController(socket.id);

	if(soc_game_controller === undefined)
	{
		return;
	}
	
	var roomNumber =  soc_game_controller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
	// roomNumber =  gamecontroller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
	var gamePlayerPresent = soc_game_controller.gamePlayers;
	if(gamePlayerPresent) // truthy
	{
		if(Object.keys(gamePlayerPresent).length == 1)
		{
			
			gamePlayerPresent[socket.id].connected = false;
			soc_game_controller.firstPlayerAlreadyDisconnected = true;
		}
	}
	store = soc_game_controller.answerStores[roomNumber];
	
	opponentId = gameMap[socket.id];
	if(store)
	{
	
	var roomObject = soc_game_controller.gameRooms[socket.id]; 
		if(!roomObject.agentPresent)
		{
			if(roomObject.gameRounds <= store.round)
			{
	
				return;
			}
		
		store.addAnswer(0, soc_game_controller.gamePlayers[socket.id]);
		store.setPlayerConnectedStatusToFalse(socket.id);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " results</div>";
		if(store.isFilled()) //when does this happen !!!
			{	
		
				opponentPlayerObject = soc_game_controller.gamePlayers[opponentId];	
				opponentPlayerObject.updateRecommender(store.answererSet[opponentId].chosenAnswer, store.answererSet[socket.id].chosenAnswer);
				var cummScore = store.players[opponentId].getCummulativeValue();
				var message = {count : store.round, text : store.players[opponentId].printResults(), rounds : roomObject.getGameRounds(), cumm:cummScore, recommendation : opponentPlayerObject.getRecommendation()};

				// gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('serverMessage', message);
				soc_game_controller.gamePlayers[opponentId].sessionSocket.emit('disconnectMessage', {cummScoreK : cummScore, roundK : store.round});
				store.clear();
			}
			else
			{ // store is not filled
				
				roomObject.gameRounds = store.round;  // set the present round to last round to end the game
			}
		}
	}
});


socket.on('timeOfAction', function(timeOfAction) { // used to set the time action took place
		var soc_game_controller = gameControllerArray.getController(socket.id);

		// var presentSocketGameCounter = playersSocketDict[socket.id];
		// if(typeof presentSocketGameCounter === 'undefined')
		// {
		// 	return;
		// }
		var playerWithTime =  soc_game_controller.gamePlayers[socket.id]; //	roomToSocket[socket.id];
		playerWithTime.setTimeOfAction(timeOfAction);
		});

socket.on('forceDisconnect', function() {
		socket.disconnect();
	});

socket.on('chatHistory', function(historyOfChats) {
		var soc_game_controller = gameControllerArray.getController(socket.id);
		
		// var presentSocketGameCounter = playersSocketDict[socket.id];
		// if(typeof presentSocketGameCounter === 'undefined')
		// {
		// 	return;
		// }

		var playerWithHistory =  soc_game_controller.gamePlayers[socket.id]; //	roomToSocket[socket.id];
		if(playerWithHistory)
		{
			playerWithHistory.saveHistory(historyOfChats);
		}
	});
	


	function getAgent(agentString)
	{
		if(agentString == 'TFT')
		{
			return new TFT();
		}
		else if(agentString === 'AD')
		{
			return new AD();
		}
		else if(agentString === 'AC')
		{
			return new AC();
		}
		else if(agentString === 'TF2T')
		{
			return new TF2T();
		}
		else if(agentString === 'Random')
		{
			return new randAgent();
		}
	}

	socket.on('playGame', function(agentAndProb) {
	
		var secondAgent = agentAndProb[0];
		var prob = agentAndProb[1];
		var agent2 = getAgent(secondAgent);
		var test = new testRecommend(agent2, 56, prob);
		var result = test.playGame();
		socket.emit('showGame', result);
		
	});
});

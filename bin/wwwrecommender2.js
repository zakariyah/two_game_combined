#!/usr/bin/env node
var debug = require('debug')('my-application');
//var connect = require('connect');
// var restler = require('restler');
var app = require('../app');
var io = require('socket.io');
// var cookieParser = require('cookie-parser');
var connecter = require('../database');
connecter('mongodb://localhost/scailabexperiment');
var SessionSockets = require('session.socket.io');
var gameController = require('../controller/gameController');
var gameplayer = require('../controller/gameplayer');

app.set('port', process.env.PORT || 4000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
  console.log('You have logged in ' + app.numberOfTimes + ' times');
});
var ionew = io.listen(server);

sessionSockets = new SessionSockets(ionew, app.sessionstore, app.cookieNew);

var gamecontroller = new gameController(2);
var gameMap = {};
var gameStartStatus = false;
// var answerStores = {};
var numberOfGameControllers = 200;
var gameControllerArray = [];
var numberOfPairs = 0;
var gameCounter = 0;
var firstPlayerJustEntered = true;
var playersSocketDict = {};
var gameTypes = ['normal', 'randomRecommenders', 'realRecommenders', 'oneRealRecommender'];
ionew.sockets.on('connection', function (socket) {

	socket.on('waitingTimeElapsed', function()
	{
		console.log("was called waiting outside");
			if(!(socket.id in gameMap)) // if player has not been already mapped
			{
				console.log("was called waiting");
				var player = new gameplayer(gameCounter + "agent", null, true, 1); //agents dont have socket
				gameControllerArray[gameCounter].addPlayer(player);
				if(gameControllerArray[gameCounter].isFilled())
				{
					startGame();
					firstPlayerJustEntered = true;
					sendMessageAndStart();
				}
				else
				{
					firstPlayerJustEntered = false;
				}
				gameCounter += 1;
			}
			
	});

	socket.on('join', function()
	{
		if(firstPlayerJustEntered)
		{
			gameControllerArray[gameCounter] = new gameController(2);
			// console.log("something happened here");
		}
		else
		{

		}
			// get Game type
			var gameTypeIndex = gameCounter % gameTypes.length;
			var presentGameType = gameTypes[gameTypeIndex];
			startGameTypeForTheNextTwoPlayers(presentGameType);		
	});

	function startGameTypeForTheNextTwoPlayers(gameType)
	{
		// if normal
		if(gameType == 'normal')
		{
			var player = new gameplayer(gameCounter, socket, false, 1);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				console.log("it happened here");
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "randomRecommenders")
		{
			var player = new gameplayer(gameCounter, socket, false, 1);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				// console.log("playersId : " + playersId);
				// console.log("gamePlayers : " + gameControllerArray[gameCounter].gamePlayers);
				for(var playerId in playersId)
				{
					// console.log("playerId : " + playerId);
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		} 
		else if(gameType == "realRecommenders")
		{
			var player = new gameplayer(gameCounter, socket, false, 1);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(false);
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		else if(gameType == "oneRealRecommender")
		{
			var player = new gameplayer(gameCounter, socket, false, 1);
			gameControllerArray[gameCounter].addPlayer(player);
			if(gameControllerArray[gameCounter].isFilled())
			{
				startGame();
				var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers);
				for(playerId in playersId)
				{
					gameControllerArray[gameCounter].gamePlayers[playersId[playerId]].setHasRecommender(true);
					break;  // to make sure only one has a recommender
				}
				
				firstPlayerJustEntered = true;
			}
			else
			{
				firstPlayerJustEntered = false;
			}
		}
		
		playersSocketDict[socket.id] = gameCounter; // dictionary to be used for getting players later on

		if(gameControllerArray[gameCounter].isFilled())
		{
			sendMessageAndStart();
			gameCounter += 1;		
		}

	}

	function startGame()
	{
	
		var playersId = Object.keys(gameControllerArray[gameCounter].gamePlayers); // createAgentToBeAddedToRooms();

// 		if(!gameStartStatus)
// 		{
			mapOutPlayers(playersId);
			// gameCounter += 1;
	}

	function sendMessageAndStart()
	{
		for(var i in gameControllerArray[gameCounter].gamePlayers)
			{
				console.log(i + " is " + gameMap[i]);
				var message = "Your opponent's id is " + gameMap[i];
				if( !gameControllerArray[gameCounter].gamePlayers[i].isAgent)
				{
					if(gameControllerArray[gameCounter].gamePlayers[i].hasRecommender)
					{
						message += " But don't worry, you have a recommender ";
					}
						var playerToSendMessage = gameControllerArray[gameCounter].gamePlayers[i];
						var roomObject = gameControllerArray[gameCounter].gameRooms[playerToSendMessage.id]; 
						var numberOfRounds = roomObject.getGameRounds();
						console.log("number of rounds :" + numberOfRounds);
						var recommenderOption = playerToSendMessage.hasRecommender ? 1 : 0;
						playerToSendMessage.sessionSocket.emit('serverMessage', {count : 0, text : message, rounds : numberOfRounds, recommenderOptionValue : recommenderOption});
						playerToSendMessage.sessionSocket.emit('start');					
				}
			}
	}

		function mapOutPlayers(playersId)
	{
		
		// console.log("length is " + playersId.length);
		for (var i = 0; i < playersId.length; i++)
		{
			var playerId = playersId[i];
			// console.log("player " + playerId + " opponent is ");
			if(i % 2 == 0)
			{
				//always execute
				gameMap[playerId] = playersId[i + 1]
				gameControllerArray[gameCounter].setPlayersToRoom(playerId, playersId[i + 1] );
				// gamecontroller.gamePlayers[playerId].setHasRecommender(false);
				// gameMap[playerId] = (i + 1);
				// gameMap[i + 1] = playerId;
				// gamecontroller.setPlayersToRoom(playerId, (i + 1) );
				// gamecontroller.pointSecondPlayerToRoom((i+1) , playerId, i);

			}	
			else
			{
				gameMap[playerId] = playersId[i - 1];
				gameControllerArray[gameCounter].pointSecondPlayerToRoom(playerId, playersId[i - 1], Math.floor(i/2));
			}
		};
	} 


	socket.on('clientMessage', function(content) {
		var options = ['A', 'B'];
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
		store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];


	if(store)
	{
		// console.log(content.timeOfAction);
		var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		store.addAnswer(content.gamePlay, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id].setTimeOfAction(content.timeOfAction);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + "</div>";


		if(roomObject.agentPresent)  //if agent is present in the game
		{
			var opponent = gameMap[socket.id];  //get agent opponent id.
			var agentMove = roomObject.player2.nextMove(content.gamePlay);
			store.addAnswer(agentMove, gameControllerArray[presentSocketGameCounter].gamePlayers[opponent]);
			var message = {count : store.round, text : (messageText  + " " + store.players[socket.id].printResults()), rounds : roomObject.getGameRounds()};
			// roomObject.player1
			// console.log("The message was sent " + roomObject.getGameRounds());
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
				{ // returns null if it has no recommender and also does nothing in update recommender
					var message = {count : store.round, text : (messageText  + " " + store.players[soc1.id].printResults()), recommendation : soc1.getRecommendation(), rounds : roomObject.getGameRounds()};
					soc1.sessionSocket.emit('serverMessage', message);
					soc1.updateRecommender(store.answererSet[soc1.id].chosenAnswer, store.answererSet[soc2.id].chosenAnswer);						
				}
				else
				{
					// take care of agents !!!	 already taken care of. Just trying to play safe
				}

				if(!soc2.isAgent)
				{
					var message2 = {count : store.round, text : (messageText  + " " + store.players[soc2.id].printResults()), recommendation : soc2.getRecommendation(), rounds : roomObject.getGameRounds()};
					soc2.sessionSocket.emit('serverMessage', message2);
					soc2.updateRecommender(store.answererSet[soc2.id].chosenAnswer, store.answererSet[soc1.id].chosenAnswer);	
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
	var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		else if(typeof gameControllerArray[presentSocketGameCounter] === "undefined")
		{
			// a case where a previous game sends an disconnect message
			return;
		}
		console.log("presentSocketGameCounter : " + presentSocketGameCounter);
	var roomNumber =  gameControllerArray[presentSocketGameCounter].roomToSocket[socket.id]; //	roomToSocket[socket.id];
	// roomNumber =  gamecontroller.roomToSocket[socket.id]; //	roomToSocket[socket.id];
	store = gameControllerArray[presentSocketGameCounter].answerStores[roomNumber];
	opponentId = gameMap[socket.id];
	if(store)
	{
	var roomObject = gameControllerArray[presentSocketGameCounter].gameRooms[socket.id]; 
		if(!roomObject.agentPresent)
		{
				a = '<div class=\"alert alert-warning\">';
		gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('disconnectMessage', a);
		store.addAnswer(0, gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]);
		store.setPlayerConnectedStatusToFalse(socket.id);
		var messageText = "<div class=\"alert alert-warning\"> Round " + store.round + " /5</div>";
		if(store.isFilled())
			{		
				var message = {count : store.round, text : (messageText  + " " + store.players[opponentId].printResults()), rounds : roomObject.getGameRounds()};
				gameControllerArray[presentSocketGameCounter].gamePlayers[opponentId].sessionSocket.emit('serverMessage', message);
				store.clear();
			}		
		}

	}
});


socket.on('timeOfAction', function(timeOfAction) {
		var presentSocketGameCounter = playersSocketDict[socket.id];
		if(typeof presentSocketGameCounter === 'undefined')
		{
			return;
		}
		var playerWithTime =  gameControllerArray[presentSocketGameCounter].gamePlayers[socket.id]; //	roomToSocket[socket.id];
		playerWithTime.setTimeOfAction(timeOfAction);
		});

});
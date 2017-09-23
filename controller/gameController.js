var room = require('../controller/room');
var answerStore = require('../controller/answerstore');

function  gameController(numberOfPlayers) //, numberOfAgents)
{
	this.numberOfPlayers = numberOfPlayers;
	// this.numberOfAgents = numberOfAgents;
	this.gamePlayers = {};
	this.gameRooms = {};
	this.answerStores = {};
	this.roomToSocket = {};
	this.firstPlayerAlreadyDisconnected = false;
	this.addPlayer = function(player)
	{
		if(player.id in this.gamePlayers)
		{
			this.gamePlayers[player.id].setSocket(player.sessionSocket); // should be removed ideally but placed there to check out some subtle bugs
		}
		else
		{
			this.gamePlayers[player.id] = player;	
		}
		// gamePlayers.push(player);
		console.log(player.id);
		console.log("the length is " + Object.keys(this.gamePlayers).length);
	}

	this.numberOfRegisteredPlayers = function()
	{
		return Object.keys(this.gamePlayers).length;
	}

	this.isFilled = function()
	{
		return Object.keys(this.gamePlayers).length  == this.numberOfPlayers;
	}

	this.setPlayersToRoom = function(playerId, opponentId)
	{
		var roomPlayer = new room(this.gamePlayers[playerId],this.gamePlayers[opponentId]);
		this.gameRooms[playerId] = roomPlayer;
	}

	this.pointSecondPlayerToRoom = function(playerId, opponentId, roomNumber)
	{
		this.gameRooms[playerId] = this.gameRooms[opponentId];
		this.answerStores[roomNumber] = new answerStore(2);
		this.roomToSocket[playerId] = roomNumber;
		this.roomToSocket[opponentId] = roomNumber;
		if(this.gamePlayers[playerId].isAgent || this.gamePlayers[opponentId].isAgent)
		{
			this.gameRooms[playerId].setAgentIsPresent();
		}

		if(this.firstPlayerAlreadyDisconnected)
		{
			this.answerStores[roomNumber].addAnswer(0, this.gamePlayers[opponentId]);
			this.gameRooms[opponentId].gameRounds = 1; // set the game round to one so it ends.			
		}
	}
}

module.exports = gameController;
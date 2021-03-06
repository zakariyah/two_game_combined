var gameController = require('./gameController');
var gameplayer = require('./gameplayer');


var gameControllerArray = function() 
{
	var game_controllers = {};
	var game_controllers_hiit = {};

	this.addPlayer = function(start_game_results, socket_id, hiitNumber)
	{
		var start_game = start_game_results.start_game;
		var players = start_game_results.players;
		var gameType = start_game_results.gameType;
		console.log("results " + JSON.stringify(start_game_results));
		console.log("socket id  " + socket_id);
		console.log("hiitNumber " + hiitNumber);		

		if(start_game)
		{
			if(gameType == 'single')
			{
				var controller_game = new gameController(2);
				game_controllers[socket_id] = controller_game;
				game_controllers_hiit[hiitNumber] = controller_game;

				/// add an agent
				
				
				return controller_game; 
			}
			else if(gameType == 'double')
			{
				var controller_game = null;
				console.log("game_controllers_hiit " + Object.keys(game_controllers_hiit));
				for(hiit_no_ind in players)
				{
					var hiit_no = players[hiit_no_ind];
					if(hiit_no in game_controllers_hiit)
					{
						console.log("game_controllers_in " + hiit_no + " id " + players);
						controller_game = game_controllers_hiit[hiit_no];
						game_controllers_hiit[hiitNumber] = controller_game;
						game_controllers[socket_id] = controller_game;

						return controller_game;
					}
					console.log("game_controllers_out " + hiit_no + " id " + players);
				}
			}
		}
		else
		{
			var controller_game = new gameController(2);
			game_controllers[socket_id] = controller_game;
			game_controllers_hiit[hiitNumber] = controller_game;


			return controller_game; 
		}
	}

	this.getController = function(socket_id)
	{
		return game_controllers[socket_id];
	}

};	

module.exports = gameControllerArray;

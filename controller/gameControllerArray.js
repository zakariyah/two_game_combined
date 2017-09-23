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
				for(hiit_no in players)
				{
					if(hiit_no in Object.keys(game_controllers_hiit))
					{
						controller_game = game_controllers_hiit[hiit_no];
						game_controllers_hiit[hiitNumber] = controller_game;
						game_controllers[socket_id] = controller_game;

						return controller_game;
					}
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
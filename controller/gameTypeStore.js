// used to assign player to the game.
// 

var gameTypeStore = function() 
{
	var store = {};
	var truth_players = [];
	var false_players = [];
	var truth_tracker_double = false;
	var false_tracker_double = false;



	this.addPlayer = function(player_hiitnumber, type)
	{
		// console.log('player hiit ' + player_hiitnumber + " type is " + type);
		if(type == "12dfare") // told humans
		{
			truth_players.push(player_hiitnumber);
			if(truth_tracker_double)
			{
				if(truth_players.length == 2)
				{
					truth_tracker_double = false;
					var truth_players_copy = truth_players;
					truth_players = [];
					return {start_game: true, players: truth_players_copy, gameType:'double'};
				}
				else
				{
					// 
					var truth_players_copy = truth_players;
					return {start_game: false, players: truth_players_copy, gameType:'single'};
				}

			}
			else
			{
				truth_tracker_double = true;
				var truth_players_copy = truth_players;
				truth_players = [];
				return {start_game: true, players: truth_players_copy, gameType:'single'};
			}

		}
		else if(type == "34chgsfsff") // told agents
		{
			false_players.push(player_hiitnumber);
			if(false_tracker_double)
			{
				if(false_players.length == 2)
				{
					false_tracker_double = false;
					false_players_copy = truth_players;
					false_players = [];
					return {start_game: true, players: false_players_copy, gameType:'double'};
				}
				else
				{
					// 
					false_players_copy = false_players;
					return {start_game: false, players: false_players_copy, gameType:'single'};
				}

			}
			else
			{
				false_tracker_double = true;
				false_players_copy = false_players;
				false_players = [];
				return {start_game: true, players: false_players_copy, gameType:'single'};
			}
		}
		else
		{
			console.log("There seems to be a problem: type neither 12dfare nor 34chgsfsff");
		}


		// console.log("123" in truth_players);
	}


};	

module.exports = gameTypeStore;
var gameStore = function() 
{
	var store = {};
	var truth_players = {};
	var false_players = {};
	var count = 0;


	this.addPlayer = function(player_hiitnumber)
	{
		console.log('player hiit ' + player_hiitnumber)
		gametype = -1;
		if(count % 2 < 1)
		{
			truth_players[player_hiitnumber] = true;
			gametype = 0; // playing against humans
			console.log('player true ' + player_hiitnumber)	
		}
		else
		{
			false_players[player_hiitnumber] = true;
			gametype= 1; //  playing against agents
			console.log('player false ' + player_hiitnumber)
		
		}
		count += 1;
		
		return gametype;
	}


	this.getGameType = function(hiit_number)
	{
		// console.log('hiit number is ' + hiit_number + ' t: ' 
		// 	+ Object.keys(truth_players) + ' f:  ' + Object.keys(false_players));
		if(hiit_number in truth_players)
		{
			// console.log("here one");
			return "12dfare";
		}
		else if(hiit_number in false_players)
		{
			// console.log("here two");
			return "34chgsfsff";
		}
		else
		{
			// console.log("here three");
			return 3;
		}
	}


};	

module.exports = gameStore;
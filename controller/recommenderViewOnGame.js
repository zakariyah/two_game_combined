var RecommenderViewOnGame = function(agent)
{
	// need to get the state of the recommender
	// 			1. Is he a leader
	// 			2. is he a follower, MBRL or follower
	// 			3. 

	// get the expert state
	// get the round number
	// generate the statements for the levels

	var recommender = agent;
	var thresholdRound = 5;


	var getInformationAboutOpponentAtRoundWithProp = function(round, properties)
	{
		var opponentInfo = [];
		var thresholdRound = 10;
		if(round == 0)
		{
			opponentInfo.push('I can\'t say anything about the other player.');
			opponentInfo.push('The game has just started');
		}
		else
		{
			var nice = properties.niceness;
			var bully = properties.bully;
			var reciprocity = properties.reciprocity;
			var reciprocateDefection = properties.reciprocateDefection;
			if(round < thresholdRound)
			{
				opponentInfo.push('The game is still quite fresh');
				opponentInfo.push('I can\'t really say anything about the other player');
				return opponentInfo;
			}
			else if(round < thresholdRound * 2)
			{
				opponentInfo.push('The game is still quite fresh but');
			}
			if(bully > 50)
			{
				opponentInfo.push('He seems to be a bully');	
			}
			else
			{
				opponentInfo.push('He seems to be a nice guy');		
			}
			if(reciprocateDefection > 50)
			{
				opponentInfo.push('He also tries to reciprocate seemingly bad behaviour');
			}
			if(round > thresholdRound)
			{
				var isLeader = properties.opponentIsLeader;
				if(isLeader)
				{
					opponentInfo.push('He is also quite assertive');
				}
				else
				{
					opponentInfo.push('He is quite passive');
				}
			}
		}
		return opponentInfo;
	}

	this.getInformationAboutOpponent = function()
	{
		var round = recommender.getRound();
		var properties = recommender.getOpponnetProperties();
		return getInformationAboutOpponentAtRoundWithProp(round, properties);
	}

	var chooseOneRandomly = function(textArray)
	{
		if(!textArray)
		{
			return
		}
		var index = Math.floor(Math.random() * textArray.length);
		return textArray[index];
	}

	var getRecommendationHtmlForExpertType = function(typeOfExpert, round)
	{
		var rec = [];
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];
		var choices = '';
		var introHasBeenSaid = false;
		if(round < thresholdRound && !introHasBeenSaid)
		{
			introHasBeenSaid = true;
			rec.push("Your success in this game depends on how well you get along (your relationship) with your associate");
			rec.push("As such, you can choose to either guide/lead him by playing A OR you can follow his lead and play along with him OR you can play as you wish for a while and see his response! ");
			rec.push("Lastly, you can also choose to minimize your loss by playing B");
			return rec;			
		}
		else if(round < thresholdRound)
		{
			rec.push('Stick to the recommendation I gave earlier on and let us how it would play out');
			return rec;
		}


		if(typeOfExpert === 'leader')
		{
			choices = ['Why not take the lead? Chooose ' + choice, 'Try bossing him around by choosing ' + choice];
		}
		else if(typeOfExpert === 'follower')
		{
			choices = ['Choosing  ' + choice + ' helps both of you do well', 'You need to accept a compromise, therefore choose ' + choice];
		}
		else if(typeOfExpert === 'bestResponse')
		{
			var state = '';
			if(recommendation == 0)
			{
				state = 'cooperative';
			}
			else
			{
				state = 'uncooperative';
			}
			choices = ['He has been ' + state + ', so choose ' + choice, 'Your best option is to choose ' + choice];
			// rec.push('You can play independently of your associate; just choose what is best for you');
		}
		else if(typeOfExpert === 'minmax')
		{
			choices = ["Things aren't looking good, protect yourself by choosing " + choice, "Your associate is exploiting you, minimize your loss by choosing " + choice];
			// rec.push('You might need to protect yourself from loss, play safe!');
		}
		rec.push(chooseOneRandomly(choices));
		return rec;
	}


	this.getRecommendation = function()
	{
		var round = recommender.getRound();
		var typeOfExpert = recommender.getTypeOfExpert();
		var recoHtml = getRecommendationHtmlForExpertType(typeOfExpert, round);
		// var options = ['A', 'B'];
		// var recommendation = recommender.latestChoice;
		// var recoHtml = []; // try to capture various emotions. 1.Assertiveness.
		// recoHtml.push('I recommend that you play ' + options[recommendation]);
		return recoHtml;
	}

	this.getReason = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();
		var htmlReason = [];
		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];
		var choices = [];
		if(typeOfExpert == 'maximinBegin')
		{
			choices = ['Let us see how this would play out. The game has just begun'];
		}
		else if(typeOfExpert == 'minmax')
		{
			// htmlReason.push('The other player is a great bully');
			// htmlReason.push('He is likely to continue to defect');
			choices.push('Your associate is expoiting you, protect yourself by choosing ' + choice);
			choices.push('You risk losing points by playing other than the recommended action');
		}
		
		if(typeOfExpert == 'leader')
		{
			// htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			// htmlReason.push('If the other player profits by veering away from the plan, he will be punished');
			choices.push('By taking the lead, you get a higher payoff');
			choices.push('Your associate is a slacker, take advantage by playing ' + choice);
		}
		else if(typeOfExpert == 'follower')
		{
			// htmlReason.push('The plan is to make you get an average of ' + (aspiration * 5).toFixed(2) + ' for each round on the long run.');
			// htmlReason.push('The other player will be taking the lead in making us achieve this threshold');
			// htmlReason.push('If the other player decides to be overtly smart, he will be dealt with');
			choices.push('You need to accept a compromise, therefore choose ' + choice);
			choices.push('You associate expects him to comply with him by choosing ' + choice);
			// choices = ['You need to accept a compromise, therefore choose ' + choice, 'You associate expects him to comply with him by choosing ' + choice];
		}
		else if(typeOfExpert == 'bestResponse')
		{
			// htmlReason.push('This might be the best response to this guy');
			if(recommendation == 0)
			{
				choices.push('He has been cooperative, so you should reciprocate by choosing ' + choice);	
			}
			else
			{
				choices.push('He has been uncooperative, so you should retaliate by choosing ' + choice);
			}
			
		}

		if(isGuilty)
		{	
				// htmlReason.push('The other player is guilty and should be dealt with.');
				// htmlReason.push('We can thus coerce him into being more cooperative');
				choices.push('You are done punishing him, now proceed by playing ' + choice);
		}
		else
		{
			choices.push('"Your associate refused to follow your lead, punish him by playing ' + choice);
		}
		
		htmlReason.push(chooseOneRandomly(choices));
		return htmlReason;
	}

	this.getReasonForNotDoingOtherwise = function()
	{
		var typeOfExpert = recommender.getTypeOfExpert(); // can be leader, follower, minmax or best response
		var targets = recommender.getTarget(); // get target of both players
		var aspiration = recommender.getAspiration(); // get the aspiration of the player
		var convictionLevel = recommender.getConvictionLevel();
		var isGuilty = recommender.isOtherPlayerGuilty();

		var options = ['A', 'B'];
		var recommendation = recommender.latestChoice;
		var choice = options[recommendation];
		var choices = [];

		var htmlReasonNotTo = [];
		if(isGuilty && typeOfExpert == 'leader')
		{
			// htmlReasonNotTo.push('The other player would feel it can always get away with impunity');
			choices.push('Your associate betrayed you! He needs to pay for it');
			choices.push('"Your associate refused to follow your lead, punish him by playing ' + choice);			
		}
		else if(typeOfExpert == 'follower')
		{
			// htmlReasonNotTo.push('Considering your opponent, other options might not make you get the desired payoff');
			choices.push("You associate is likely to punish you in future rounds if you don't compky with him.");
		}
		else if(typeOfExpert == 'bestResponse')
		{
			// htmlReasonNotTo.push("This should be better for you");
			choices.push("You should act in your best interest");
		}
		else if(typeOfExpert == 'minmax')
		{
			choices.push("You are vulnerable, if you don't protect yourself, your partner will exploit you");
		}

		htmlReasonNotTo.push(chooseOneRandomly(choices));
		return htmlReasonNotTo;
	}

	this.howToDoBetter = function()
	{
		var expertDoingBetter = recommender.getBetterExperts();
		var betterHtml = [];
		if(expertDoingBetter)
		{
			betterHtml.push('You and the other player can make an average of ' + (expertDoingBetter[0] * 5).toFixed(2) + ' and ' + expertDoingBetter[1] * 5 + ' per round respectively');
			betterHtml.push('All you have to do is to ');
		}
		else
		{
			betterHtml.push('This seems to be the best you can achieve against this opponent');
		}
		return betterHtml;
	}


	this.getSolutionForRound = function()
	{
		return {'doBetter' : this.howToDoBetter(), 'reason' : this.getReason(), 'reasonOtherwise' : this.getReasonForNotDoingOtherwise(), 'recommendation' : this.getRecommendation(), 'opponentInfo' : this.getInformationAboutOpponent(), 'agentChoice' : recommender.latestChoice, 'agentVariables' : recommender.getAgentVariables()};
	}
}

module.exports = RecommenderViewOnGame;
function jefe_plus(nombre, _me, _A, _M, _lambda ) //, _game[1024])
{  
	this.distinctExpertWasChosen = false;
	this.anExpertHasBeenExecutedForCompleteCycle = false;
	this.satisfiedWithLastRound = false;
	this.forgivesOtherPlayer = false;
	this.defectedAgainstSPlusPlus = false;
	this.profitedFromDefection = false;
	this.punishedGuiltyPartner = false;
	this.succeededInPunishingGuiltyPartner = false;
	this.CanReceiveHigherPayoff = false;
	this.latestChoice = -1;
	this.gameHistory = [];

	this.expertName;
	// learner is a for S++
	// br is RMAx
	// re = REExperts
	this.A = []; // [2,2] for pd: number of players on both sides
	this.A[0] = _A[0];
	this.A[1] = _A[1];
	this.me = _me; // player index
	this.game = [];
	this.M = _M; // game Matrix
	// this.strcpy(this.game, _game); check

	this.numStates = this.A[0] * this.A[1]; // possible actions
	this.t = 0; // most likely round number

	this.beenThere = [];
	this.experto = -1;
	this.estado = -1;
	this.cycled = false;

	var a  = require('./a');
	var Rmax  = require('./Rmax');
	var Exp3  = require('./Exp3');
	var eee  = require('./eee');
	var ucb  = require('./ucb');
	var iModel  = require('./iModel');
	var SolutionPair  = require('./SolutionPair');
	var REExpert  = require('./REExpert');
	var minimaxLog  = require('./minmax');


	this.REcount = 0; // number of set of experts
	this.br ; // placeholder for best response
	this.satisficingExperts = [];
	
	this.attack0;
	this.attack1;
	this.re = [];

	this.mnmx = [];

	this.computeMaximin = function(index)
	{
		var i, j;

		var payoff = [];
		var count = 0;
		for( i = 0; i < this.A[0]; i++)
		{
			for(j = 0; j < this.A[1]; j++)
			{
				payoff[count] = this.M[index][i][j];
				count ++;
			}
		}

		var mm = new minimaxLog(this.A[index]);
		mm.getMinimax(this.A, index, payoff);

		return mm;
	}

	this.computeAttack = function(index)
	{
		var i, j;
		var payoff = [];

		var count = 0;
		for( i = 0; i < this.A[0]; i++)
		{
			for(j = 0; j < this.A[1]; j++)
			{
				payoff[count] = -(this.M[1 - index][i][j]);
				count ++;
			}
		}

		var mm = new minimaxLog(this.A[index]);
		mm.getMinimax(this.A, index, payoff);

		return mm;
	}


	this.pay = function(_meh, _sol)
	{
		var a0, a1;
		a0 = Math.floor(_sol / this.A[1]);
		a1 = Math.floor(_sol % this.A[1]);
		// console.log(this.me + ' me is ');
		return this.M[_meh][a0][a1];
	}

	this.createSolutionPairs = function(Theta)
	{ // Theta is an empty list to be initiated
		// I dont get what it is capturing
		var c = 0;
		for(var i = 0; i < this.numStates; i++)
		{
			for(var j = i; j < this.numStates; j++)
			{
				Theta[c] = new SolutionPair(); // just an object with no methods
				Theta[c].s1 = i;
				Theta[c].s2 = j;
				Theta[c].one = (this.pay(0, Theta[c].s1) + this.pay(0, Theta[c].s2)) / 2.0;
				Theta[c].two = (this.pay(1, Theta[c].s1) + this.pay(1, Theta[c].s2)) / 2.0;

				Theta[c].min = Theta[c].one;
				if(Theta[c].one > Theta[c].two)
				{
					Theta[c].min = Theta[c].two;
				}
				c++;
			}
		}
	}

	this.tau = 0;
	this.R = 0.0;

	this.resetCycle = function()
	{
		// this function initialize the following variables. 
		// to be called at the start of a cycle (verify)
		// beenThere indcates that a cycle has occurred
		this.tau = 0;
		this.R = 0.0;
		for(var i = 0; i < this.numStates; i++) // numStates = 4 for pd 
			this.beenThere[i] = false;

		if(this.estado >= 0) // this.estado most likely stating the state the algorithm is in
			this.beenThere[this.estado] = true;
	}

	this.determineStrategyPairs = function()
	{
		var numSolutionPairs = 0;
		for(var i = 0; i < this.numStates; i++)
		{
			numSolutionPairs += (i + 1);  // 10 for pd
		}

		var Theta = [];
		this.createSolutionPairs(Theta);

		this.mnmx[0]= this.computeMaximin(0);
		this.mnmx[1]= this.computeMaximin(1);
		this.attack0 = this.computeAttack(0);
		this.attack1 = this.computeAttack(1);

		// console.log("maximins: " + this.mnmx[0].mv +" " + this.mnmx[1].mv);
		this.REcount = 0;
		this.re = [];
		// console.log("solution pairs " + numSolutionPairs);
		for( var i = 0; i < numSolutionPairs; i++)
		{
			// console.log("Theta.one:" + Theta[i].one + " mnmx.mv:" + this.mnmx[0].mv + " Theta[i].two:" + Theta[i].two + " mnmx[1].mv:" + this.mnmx[1].mv);
			if((Theta[i].one >= this.mnmx[0].mv) && (Theta[i].one > 0) && (Theta[i].two >= this.mnmx[1].mv) && (Theta[i].two > 0))
			{
				// console.log("creating something");
				// creating an expert for solution pairs that are greater than maximin for both players
				this.re[this.REcount] = new REExpert(this.me, this.M, this.A, Theta[i].s1, Theta[i].s2, this.attack0, this.attack1);
				this.REcount ++;
			}
		}
	}

	this.determineExperts = function()
	{
		//initialize a number of variables and select the set of experts to be used for the game
		this.resetCycle();
		this.determineStrategyPairs();
		var numEs = this.REcount * 2 + 2;
		this.br = new Rmax(this.me, this.A, this.M, 1, 0, 0.95);
		this.satisficingExperts =  [];
		for(var i = 0; i< numEs; i++)
		{
			this.satisficingExperts[i] = true;
		}
		return numEs;
	}

	

 	this.numExperts = this.determineExperts(); // most likely number of experts including maximin and best response
	// console.log("numExperts " + this.numExperts);

	this.cycleFull = true;

	this.numSatExperts = 1;
	this.lambda = 1 - (( 1.0/ this.numSatExperts) * 0.04);

	if( nombre == "S++")
	{
		this.learner = new a(_me, _A, _M, _lambda, this.numExperts);
		this.cycleFull = false; 
	}
	else if ((nombre == "exp3w++") || (nombre == "exp3"))
	{
		this.learner = new Exp3(this.me, Math.floor(_lambda), 0.99, this.numExperts);
	}
	else if(nombre == "eeew++")
	{
		this.learner = new eee(_me, _lambda, this.numExperts);
	}
	else if( nombre == "ucbw++")
	{
		this.learner = new ucb(_me, _lambda, this.numExperts);
	}
	else
	{
		// console.log("expert learner not found");
		return;
	}

	this.im = new iModel(this.me, this.A, 1);
	
	this.setAspirationFolkEgal = function()
	{
		// console.log("I was caled");
		// set the aspiration 
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" no good expert ");
			// console.log();
			return;
		}

		var i, j, index = -1;
		var high = 0.0;
		var theMin;
		var s;
		for(i = 0; i < this.REcount; i++)
		{// trying to find the maximum of the least of the two values
			// this in some way gets the best solution
			theMin = this.re[i].barR[this.me];
			if(theMin > this.re[i].barR[1 - this.me])
				theMin = this.re[i].barR[1 - this.me];

			if(theMin > high)
			{
				high = theMin;
				index = i;
			}
		}

		this.learner.aspiration = this.re[index].barR[this.me];
		if(this.learner.aspiration < this.mnmx[this.me].mv)
			this.learner.aspiration = this.mnmx[this.me].mv;
		// console.log(" initial aspiration levele = " + this.me + ", " + this.learner.aspiration);
	}

	this.setAspirationFolkEgal(); //sets the aspiration level for the learner
	this.mu = 0.0;

	this.vu = [];
	this.usage = [];
	for(var i = 0; i < this.numExperts; i++)
	{
		this.vu[i] = 1.0;
		this.usage[i] = 0.0;
	}

	this.alwaysMM = false;
	this.permissibleLoss = 3.0;

	// this.lowAspiration = 1.0;

	this.previousActs = [];
	
	

	// this.determineStrategyPairs = function()
	// {
	// 	var numSolutionPairs = 0;
	// 	for(var i = 0; i < this.numStates; i++)
	// 	{
	// 		numSolutionPairs += (i + 1);
	// 	}

	// 	var Theta = [];
	// 	this.createSolutionPairs(Theta);

	// 	this.mnmx[0]= this.computeMaximin(0);
	// 	this.mnmx[1]= this.computeMaximin(1);
	// 	this.attack0 = this.computeAttack(0);
	// 	this.attack1 = this.computeAttack(1);

	// 	// console.log("maximins: " + this.mnmx[0].mv +" " + this.mnmx[1].mv);
	// 	this.REcount = 0;
	// 	this.re = [];
	// 	for( var i = 0; i < this.numSolutionPairs; i++)
	// 	{
	// 		if((Theta[i].one >= this.mnmx[0].mv) && (Theta[i].one > 0) && (Theta[i].two >= this.mnmx[1].mv) && (Theta[i].two > 0))
	// 		{
	// 			// console.log("creating something");
	// 			this.re[this.REcount] = new REExpert(this.me, this.M, this.A, Theta[i].s1, Theta[i].s2, this.attack0, this.attack1);
	// 			this.REcount ++;
	// 		}
	// 	}
	// }

	// this.createSolutionPairs = function(Theta)
	// {
	// 	var c = 0;
	// 	for(var i = 0; i < this.numStates; i++)
	// 	{
	// 		for(var j = i; j < this.numStates; j++)
	// 		{
	// 			Theta[c] = new SolutionPair();
	// 			Theta[c].s1 = i;
	// 			Theta[c].s2 = j;
	// 			Theta[c].one = (this.pay(0, Theta[c].s1) + this.pay(0, Theta[c].s2)) / 2.0;
	// 			Theta[c].two = (this.pay(1, Theta[c].s1) + this.pay(1, Theta[c].s2)) / 2.0;

	// 			Theta[c].min = Theta[c].one;
	// 			if(Theta[c].one > Theta[c].two)
	// 			{
	// 				Theta[c].min = Theta[c].two;
	// 			}
	// 			c++;
	// 		}
	// 	}
	// }


	this.move = function()
	{
		var highestNumber = 37542;
		if(this.estado < 0)
		{
			console.log('estado is less than zero');
			this.latestChoice = Math.floor(Math.random() * highestNumber) % this.A[this.me];
			this.expertName = 'maximinBegin';
			return this.latestChoice;
		}
		if(this.cycled)
		{
			// a new cycle begins
			var oldExperto = this.experto;
			this.resetCycle();
			this.determineSatisficingExperts();
			this.numSatExperts = 0;
			for(var i = 0; i < this.numExperts; i++)
			{
				if(this.satisficingExperts[i])
					this.numSatExperts ++;
			}

			this.experto = this.learner.select(this.satisficingExperts); // to get the expert to be used
			// console.log('cycled ' + this.learner.expertName);
			if((this.experto > 1) && (this.experto != oldExperto))
			{
				var ind = this.experto - 2;
				if(ind >= this.REcount)
					ind -= this.REcount;
				// console.log("previousActs " + this.previousActs);
				// this.re stands for the experts array
				// this tries to reset the chosen expert.
				this.re[ind].reset(this.previousActs);
			}
			// to know if old expert was chosen. 
			// my own code
			if(this.experto == oldExperto)
			{
				// previous expert was chosen
			}
			else
			{
				this.distinctExpertWasChosen = true;
			}

			this.cycled = false;
		}

		var a;
		// console.log('experto is :' + this.experto + ' at t ' + this.t);
		// this.experto = 1;
		if(this.experto == 0)
		{//maximin
			a = this.generateAction(this.me, this.mnmx[this.me].ms);
			// console.log('minimax used');
			this.expertName = 'minmax';
		}
		else if(this.experto == 1)
		{// best response
			a = this.br.moveGreedy();
			// console.log('expert is ' + this.br.expertName);
			this.expertName = 'bestResponse';
		}
		else if((this.experto % 2) == 0)
		{ // leader part of algorithm
			a = this.re[(this.experto - 2) / 2].act(this.me);
			// console.log('expert is ' + this.re[(this.experto - 2) / 2].expertName);
			this.expertName = 'leader';
		}
		else
		{ // follower part of algorithm
			a = this.generateAction(this.me, this.re[Math.floor((this.experto - 2)/ 2)].asTheFollower.follower[this.estado]);
			// console.log('expert is ' + this.re[Math.floor((this.experto - 2)/ 2)].expertName + ' :follower');
			this.expertName = 'follower';			
		}
		this.latestChoice = a;
		return a;
	}

	this.update = function(acts)
	{
		this.gameHistory.push(acts);
		this.anExpertHasBeenExecutedForCompleteCycle = false;
		this.distinctExpertWasChosen = false;
		this.previousActs[0] = acts[0];
		this.previousActs[1] = acts[1];
		
		// console.log('R before ' + this.R);
		// console.log('acts before ' + acts);
		// console.log('M before ' + this.M[this.me][acts[0]][acts[1]]);


		this.R += this.M[this.me][acts[0]][acts[1]];
		this.mu += this.M[this.me][acts[0]][acts[1]];

		// console.log('R after ' + this.R);
		
		this.br.update(acts); // br is an obect of Rmax
		if(this.estado >= 0) // state is greater than zero
		{
			// im is an object of iModel
			// update method 
			this.im.update(acts, this.estado, this.t); 
		}

		this.estado = this.encodeJointAction(acts);

		if(this.experto < 0)
		{
			this.cycled = true;
			this.t ++;
			return;
		}

		if(this.experto > 1)
		{
			var ind = Math.floor((this.experto - 2)/ 2);
			this.re[ind].update(this.me, acts);
			this.profitedFromDefection = this.re[ind].guilty;
		}
		else
		{
			this.profitedFromDefection = false;
		}

		this.usage[this.experto]++;
		var betita = 1.0 / this.usage[this.experto];
		if(betita <= (2.0 * (1.0 - this.lambda)))
			betita = 2.0 * (1.0 - this.lambda);

		this.vu[this.experto] = betita * this.M[this.me][acts[0]][acts[1]] + (1.0 - betita) * this.vu[this.experto];

		if(this.cycleFull)
		{
			if(this.tau == (this.numStates - 1))
				{
					this.cycled = true;
					this.anExpertHasBeenExecutedForCompleteCycle = true;
				}
		}
		else
		{
			if(this.beenThere[this.estado])
			{
				this.cycled = true;
				this.anExpertHasBeenExecutedForCompleteCycle = true;
			}
		}

		this.beenThere[this.estado] = true;
		this.t++;
		this.tau ++;

		if(this.cycled)
		{
			this.lambda = 1 - ((1.0 / this.numSatExperts)  * 0.04);
			this.learner.lambda = this.lambda;
			this.learner.update(this.R / this.tau, this.tau);
			if(((this.mnmx[this.me].mv * this.t) - this.mu) > this.permissibleLoss )
				this.alwaysMM = true;
		}

		// if(this.learner.aspiration < this.lowAspiration)
		// 	this.lowAspiration = this.learner.aspiration;
	}

	this.override = function()
	{
		if(this.alwaysMM)
		{
			this.satisficingExperts[0] = true;
			return true;
		}

		var brVal = this.br.maxV(this.estado) * (1.0 - 0.95);
		if(brVal >= this.learner.aspiration)
		{
			var highVal = -99999;
			var ind;
			for(var i = 2; i < this.numExperts; i+=2)
			{
				ind = (i - 2) / 2;
				if(this.re[ind].barR[this.me] >= this.learner.aspiration)
				{
					if(this.re[ind].enforceable)
					{
						if(highVal < this.vu[i])
							highVal = this.vu[i];
					}

					if(this.im.match(this.re[ind].asTheFollower.teacher))
					{
						if(highVal < this.vu[i + 1])
							highVal = this.vu[i + 1];
					}
				}
			}

			if(this.vu[1] >= highVal)
			{
				this.satisficingExperts[1] = true;
				return true;
			}
		}
		return false;
	}

	this.determineSatisficingExperts = function()
	{
		var ind;
		for(var i = 0; i < this.numExperts; i++)
			this.satisficingExperts[i] = false;

		var verbose = false;
		if(this.verbose)
		{
			// console.log("Satisficing Experts for " + this.me + " alpha = " + this.learner.aspiration);
			this.im.print();
		}

		if(this.override())
			return;

		var c = 0;
		if(this.mnmx[this.me].mv >= this.learner.aspiration)
		{
			this.satisficingExperts[0] = true;
			c ++;

			if(this.verbose)
				console.log("minimax");
		}

		for(var i = 2; i < this.numExperts; i+=2)
		{
			ind = (i - 2) / 2;
			if(this.re[ind].barR[this.me] >= this.learner.aspiration)
			{
				if(this.re[ind].enforceable)
				{
					this.satisficingExperts[i] = true;
					c++;

					if(this.verbose)
						this.re[ind].printExpert(i, this.vu[i]);
				}

				if(this.im.match(this.re[ind].asTheFollower.teacher))
				{
					this.satisficingExperts[i + 1] = true;
					c ++;

					if(this.verbose)
						this.re[ind].printExpert( i + 1, this.vu[ i + 1]);
				}
			}
		}

		var brVal = this.br.maxV(this.estado) * (1.0 - 0.95);

		if((c == 0) || (brVal >= this.learner.aspiration))
		{
			this.satisficingExperts[1] = true;
			c ++;

			if(this.verbose)
			{
				console.log(" \t1  :");
				for(var i = 0; i < this.numStates; i++)
				{
					console.log(this.br.argmax(i));
				}
				console.log(" projected = " + brVal + ", actual = " + this.vu[i]);
			}
		}
	}


	

	


	this.setAspirationHigh = function()
	{
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log("no good expert ");
			return;
		}

		var i, j, index = -1;
		var high = this.mnmx[this.me].mv;
		var s;

		for(i = 0; i < this.REcount; i++)
		{
			if(this.re[i].barR[this.me] > high)
			{
				high = this.re[i].barR[this.me];
				index = i;
			}
		}

		this.learner.aspiration = high;
		// console.log(" initial aspiration level = " + this.me + " " + this.learner.aspiration);
	}

	

	this.setAspirationHighestEnforceable = function()
	{
		if(this.REcount == 0)
		{
			this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" no good expert ");
			return;
		}

		var i, j, index = -1;
		var high = 0.0;
		var val, s;

		for(i = 0; i < this.REcount; i++)
		{
			if(this.re[i].enforceable && (this.re[i].barR[this.me] > high))
			{
				high = this.re[i].barR[this.me];
				index = i;
			}
		}

		if(index == -1)
		{
			console.log(" nothing is enforceable");
			this.setAspirationFolkEgal();
		}
		else
		{
			this.learner.aspiration = this.re[index].barR[this.me];
			if(this.learner.aspiration < this.mnmx[this.me].mv)
				this.learner.aspiration = this.mnmx[this.me].mv;
			console.log(" initial aspiration level " + this.me + ", " + this.aspiration);
		}
	}


	this.printStrat = function(strat)
	{
		console.log("<");
		var i, j;
		if(strat == 0)
		{
			for(i = 0; i < this.numStates; i++)
				console.log("x");
		}
		else if(strat == 1)
		{
			for( i = 0; i< this.numStates; i++)
				console.log(this.br.argmax(i));
		}
		else
		{
			var ind = Math.floor((strat - 2) / 2);
			var a;
			var agente = this.re[ind].asTheTeacher.teacher;
			if(strat% 2 == 1)
				agente = this.re[ind].asTheFollower.follower;
			var agent;
			for(i = 0; i < this.numStates; i++)
			{
				a = -1;
				for(j = 0; j < this.A[this.me]; j++)
				{
					if(agente[i][j] > 0.99)
						a = j;
				}
				if( a < 0)
					console.log("m");
				else
					console.log(a);
			}
		}
		console.log(">");	
	}

	this.generateAction = function(index, pt)
	{
		var highestNumber = 37972;
		var num = Math.floor(Math.random() * highestNumber) % highestNumber;
		var i;

		var sum = 0.0;
		for( i = 0; i < this.A[index]; i++)
		{
			sum += pt[i] * highestNumber;
			if(num <= sum)
			{
				return i;
			}
		}

		console.log(" never selected an action : " + this.me + ", " + num );
		console.log(this.pt[0] + " " + this.pt[1]);
		return -1;
	}

	this.encodeJointAction = function(_actions)
	{
		// console.log('acts is ' + _actions + ' at ' + this.getRound());
		return this.A[1] * _actions[0] + _actions[1];
	}

	this.getAgentVariables = function()
	{
		var targetForOpponent = null;
		var target = null;
		if(this.experto > 1)
		{
			target = this.re[Math.floor((this.experto - 2) / 2)].barR[0].toFixed(2);
			targetForOpponent = this.re[Math.floor((this.experto - 2) / 2)].barR[1].toFixed(2);
		}
		return [this.distinctExpertWasChosen, this.anExpertHasBeenExecutedForCompleteCycle, this.profitedFromDefection, this.expertName, this.learner.aspiration, target, targetForOpponent ]
	}

	// methods to get the state of opponent: to be used by chat
	this.calculateOpponentState = function()
	{
	
		var history = this.gameHistory ;
		if(history.length == 0)
		{
			return;
		}
		var rec = 0;
		var nice = history[0][1] == 1;
		var bul = 0;
		var recD = [0,0];
		for(var i = 0; i < history.length; i++)
		{
			if(i != 0)
			{
				if(history[i][1] == history[i-1][0])
				{
					rec += 1;
				}	

				if(history[i-1][0] == 1)
				{
					if(history[i][1] == 1)
					{
						recD[0] += 1	
					}
					recD[1] += 1
				}
			}

			if(history[i][0] == 0 && history[i][1] == 1)
			{
				bul += 1;
			}
		}

		if(recD[1] == 0)
		{
			recD = 0;
		}
		else
		{
			recD = recD[0]/recD[1] * 100;
		}
		var reciprocity = rec / history.length * 100;
		var bully = bul / history.length * 100;
		var niceness = nice;
		var reciprocity = reciprocity.toFixed(2);
		var bully = bully.toFixed(2);

		return {reciprocity : reciprocity, bully : bully, niceness : niceness, reciprocateDefection : recD};
	}


	// methdds to be used by the chat
	this.getRound = function()
	{
		// return the round number
		return this.t;
	}

	this.getOpponnetProperties = function()
	{
		
		
		return this.calculateOpponentState();
	}

	this.getTypeOfExpert = function()
	{
		// return the type of expert, leader, follower, minmax or best response
		return this.expertName;
	}

	this.getTarget = function()
	{
		// return the target of the expert
		var target = null;
		if(this.experto > 1)
		{
			target = this.re[Math.floor((this.experto - 2) / 2)].barR[0].toFixed(2);
		}
		return target;
	}

	this.getOpponnetTarget = function()
	{
		var targetForOpponent = null;
		if(this.experto > 1)
		{
			targetForOpponent = this.re[Math.floor((this.experto - 2) / 2)].barR[1].toFixed(2);
		}
		return targetForOpponent;
	}

	this.getAspiration = function()
	{
		// return the aspiration of the recommender.
		return this.learner.aspiration;
	}

	this.getConvictionLevel = function()
	{
		// return how sure the recommender is of the advice
		// not yet implemented
		return 0;
	}

	this.isOtherPlayerGuilty = function()
	{
		// return the guilt of the other player, true or false
		return this.profitedFromDefection;
	}

	this.getBetterExperts = function()
	{
		// get the state of the game : use the expert name to make decisions
		// return an expert that is better or false if there is none
		if(this.expertName == 'minmax')
		{
			return false;
		}
		var myTarget = this.getTarget();
		var opponentTarget = this.getOpponnetTarget();
		var changed = false;
		var bestForMe = (myTarget ? myTarget : 0);
		var bestForPartner = (opponentTarget ? opponentTarget : 0);
		for(var i = 0; i < this.re.length; i++)
		{
			if(bestForMe < this.re[i].barR[0] && bestForPartner < this.re[i].barR[1])
			{
				bestForMe = this.re[i].barR[0];
				bestForPartner = this.re[i].barR[1];
				changed = true;
			}
		}

		return (changed ? [bestForMe, bestForPartner] : changed);
	}

	this.getAgentVariables = function()
	{
		var targetForOpponent = null;
		var target = null;
		if(this.experto > 1)
		{
			target = this.re[Math.floor((this.experto - 2) / 2)].barR[0].toFixed(2);
			targetForOpponent = this.re[Math.floor((this.experto - 2) / 2)].barR[1].toFixed(2);
		}
		return [this.distinctExpertWasChosen, this.anExpertHasBeenExecutedForCompleteCycle, this.profitedFromDefection, this.expertName, this.learner.aspiration, target, targetForOpponent ]
	}

}

module.exports = jefe_plus;
var Rmax = function(_me, _A, _M, _omega, _K, _gamma)
{ // best response
	this.expertName = 'RMax';
	var constants = require('./constants');
	this.MAXLENGTH = constants.MAXLENGTH;
	this.me = _me;
	this.A = [];
	for(var i = 0; i < _A.length; i++)
	{
		this.A[i] = _A[i];
	}
	this.M = _M;
	this.omega = _omega;
	this.K = _K;
	this.gamma = _gamma;
	this.numJointActions = this.A[0];
	for(var i = 1; i < _A.length; i++)
	{
		this.numJointActions *= this.A[i];
	}
	this.numStates = Math.pow(this.numJointActions, this.omega);
	// console.log("num states " + this.numStates);
	this.kappa = [];
	this.kappa[0] = [];
	this.kappa[1] = [];
	this.pi = [];
	this.opi = [];
	for(var  i = 0; i < this.numStates; i++)
	{
		this.kappa[1 - this.me][i] = [];
		this.kappa[this.me][i] = [];
		this.pi[i] = [];
		this.opi[i] = [];
		for(var j = 0; j < this.A[1 - this.me]; j++)
		{
			this.kappa[1 - this.me][i][j] = 0;
			this.opi[i][j] = 1.0 / this.A[1 - this.me];
		}

		for(var j = 0; j < this.A[this.me]; j++)
		{
			this.kappa[this.me][i][j] = 0;
			this.pi[i][j] = 1.0 / this.A[this.me];
		}
	}

	this.values = [];
	for(var i = 0; i < this.numStates + 1; i++)
	{
		this.values[i] = [];
		for(j = 0; j < this.A[this.me]; j++)
		{
			// console.log(j);
			this.values[i][j] = 0.0;
		}
	}


	this.initOptimisticState = function()
	{
		var mx = -99999;
		for(var i = 0; i < this.A[0]; i++)
		{
			for(var j = 0; j < this.A[1]; j++)
			{
				if(this.M[this.me][i][j] > mx)
				{
					mx = this.M[this.me][i][j];
				}
			}
		}

		for(var i = 0; i < this.A[this.me]; i++)
		{
			// console.log("le: " + mx / (1.0 - this.gamma));
			this.values[this.numStates][i] = mx / (1.0 - this.gamma);
		}
	}

	this.initOptimisticState();
	this.currentHistory = [];
	this.dummyHist = [];
	for(var i = 0; i < this.omega; i++)
	{
		this.currentHistory[i] = [];
		this.dummyHist[i] = [];
		for(var j = 0; j < this.A.length; j++)
		{
			this.currentHistory[i][j] = -1;
		}
	}


	this.getJointAction = function(num, index)
	{
		var val = Math.pow(this.numJointActions, index + 1);
		var ja = num % val;
		// console.log(val + " : " + this.numJointActions + " : " + index);
		return ja;
	}

	var num, ja;
	this.stateHistories = [];
	for(var i = 0; i < this.A.length; i++)
	{
		num = i;
		this.stateHistories[i] = [];
		for(var j = 0; j < this.omega; j++)
		{
			this.stateHistories[i][j] = [];
			ja = this.getJointAction(num, j);
			num = Math.floor(num / this.numJointActions);
			this.stateHistories[i][j][0] = Math.floor(ja / this.A[1]);
			// console.log(this.stateHistories[i][j][0]);
			this.stateHistories[i][j][1] = ja % this.A[1];
		}
	}

	// have to put some things here
	this.estado = -1;
	this.t = 0;

	this.selectAction  = function(s)
	{
		var num = Math.random();
		var sum = 0.0;
		// console.log(this.pi );
		// console.log("s is " + s);
		for(var i = 0; i < this.A[this.me]; i++)
		{
			sum += this.pi[s][i];
			if(num < sum)
				break;
		}
		// console.log("i is : " + i);
		if(i == this.A[this.me])
		{
			i--;
		}

		return i;
	}


	this.move = function()
	{
		var exp1 = 1.0/ (10.0 + (this.t / 100.0));
		var num =  Math.random();
		// console.log(exp1);
		if((num < exp1) || (this.estado < 0))
		{
			console.log("r");
			var highestNumber = 37972;
			return Math.floor(Math.random() * highestNumber) % this.A[this.me];
		}

		return this.selectAction(this.estado);
	}

	this.moveGreedy = function()
	{
		// console.log(this.estado);
		if(this.estado < 0)
		{
			return Math.floor(Math.random() * 37972) % this.A[this.me];
		}
		return this.selectAction(this.estado);
	}

	this.update = function(acts)
	{
		// console.log("was called");
		var sprime = this.updateCurrencyHistory(acts);
		// console.log("The culprit are " + acts);
		// if(sprime == 4)
		// {
			
		// }
		if(this.estado >= 0)
		{
			this.kappa[1 - this.me][this.estado][acts[1 - this.me]] ++;
			this.kappa[this.me][this.estado][acts[this.me]] ++;
			var sum = 0;
			for(var j = 0; j < this.A[1 - this.me]; j++)
			{
				sum += this.kappa[1 - this.me][this.estado][j];
			}
			for(var j = 0; j < this.A[1 - this.me]; j++)
			{
				this.opi[this.estado][j] = this.kappa[1 - this.me][this.estado][j]/sum;
			}

			this.bestResponse(this.M, this.opi);
			
		}
		// console.log("sprime is " + sprime);
		this.estado = sprime;
		this.t ++;
	}
	
	this.updateCurrencyHistory = function(_actions)
	{		
		for(var i = 0; i < (this.omega - 1); i++)
		{
			this.currentHistory[i][0] = this.currentHistory[i + 1][0];
			this.currentHistory[i][1] = this.currentHistory[i + 1][1];
		}

		this.currentHistory[this.omega - 1][0] = _actions[0];
		this.currentHistory[this.omega - 1][1] = _actions[1];

		return this.stateFromHistory(this.currentHistory);
	}

	this.state = function(hist, a0, a1)
	{
		for(var i = 0; i < (this.omega - 1); i++)
		{
			this.dummyHist[i][0] = hist[i + 1][0];
			this.dummyHist[i][1] = hist[i + 1][1];
		}

		this.dummyHist[this.omega - 1][0] = a0;
		this.dummyHist[this.omega - 1][1] = a1;

		return this.stateFromHistory(this.dummyHist);
	}

	this.stateFromHistory = function(hist)
	{
		// console.log(hist);
		if(hist[0][0] < 0)
		{
			return -1;
		}

		var val, num = 0;
		for(var i = 0; i < this.omega; i++)
		{
			val = this.A[1] * hist[i][0] + hist[i][1];
			num += val * Math.pow(this.numJointActions, i);
		}

		return num;
	}

	this.bestResponse = function(M, opi)
	{
		// console.log(M);
		var change = 99999;
		while(change > 0.000001)
		{
			// console.log("here:" + change);
			change = this.greedyValueIteration(M, opi);
		}
		for(var s = 0; s < this.numStates; s++)
		{
			for(var j = 0; j < this.A[this.me]; j++)
			{
				this.pi[s][j] = 0.0;				
			}
			this.pi[s][this.argmax(s)] = 1.0;
		}
	}


	this.greedyValueIteration = function(M, opi)
	{
		// console.log("was called");
		var s, sprime, a, i , j, nv, change = 0.0;
		var hist = [];
		// console.log(opi);
		for(i = 0; i < this.MAXLENGTH; i++)
		{
			// MAXLENGTH not yet known
			// console.log(this.MAXLENGTH);
			hist[i] = [];
			for(j = 0; j < this.A.length; j++)
			{
				hist[i][j] = 0;
			}
		}

		// console.log(hist);

		for(s = 0; s < this.numStates; s++)
		{
			for(a = 0; a < this.A[this.me]; a++)
			{
				if(this.kappa[this.me][s][a] < this.K)
				{
					nv = this.maxV(this.numStates);
				}
				else
				{
					nv = 0.0;
					for(j = 0; j < this.A[1 - this.me]; j++)
					{
						if(this.me == 0)
						{
							sprime = this.state(this.stateHistories[s], a, j);
						}
						else
						{
							sprime = this.state(this.stateHistories[s], j, a);
						}

						if(this.me == 0)
						{
							nv += opi[s][j] * (M[this.me][a][j] + this.gamma * this.maxV(sprime));
						}
						else
						{
							nv += opi[s][j] * (M[this.me][j][a] + this.gamma * this.maxV(sprime));
						}
					}
				}

				change += Math.abs(this.values[s][a] - nv);
				this.values[s][a] = nv;
			}
		}

		return change;
	}

	this.maxV = function(s)
	{
		var max = 0;
		for(var i = 1; i < this.A[this.me]; i++)
		{
			if(this.values[s][max] < this.values[s][i])
				max = i;
		}
		return this.values[s][max];
	}

	this.argmax = function(s)
	{		
		var max = 0;
		for(var i = 1; i < this.A[this.me]; i++)
		{
			var oneOrZero  = Math.floor((Math.random()) + 0.5);
			if((this.values[s][max] < this.values[s][i]) || ((this.values[s][max] == this.values[s][i]) && (oneOrZero)))
			{
				max = i;
			}
		}
		return max;
	}

	this.printV = function()
	{
		var s , j;
		console.log("\n For player " + this.me);
		for(s = 0; s < this.numStates; s++)
		{
			console.log(s);
			for(j = 0; j < this.A[this.me]; j++)
			{
				console.log(" some values ");
			}
		}
	}

}

module.exports = Rmax;
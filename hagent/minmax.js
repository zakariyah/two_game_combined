var minimax = function(_nActions)
{	
	this.expertName = 'minimax';
	this.SENTINAL =  -999999;  // this is a constant
	this.GRANULARITY = 0.000001; // this is a constant
	this.ms = []; //array of double of size _nActions
	this.mpi = [];	//array of double of size _nActions
	this.mv = this.lowmv =  -Math.abs(this.SENTINAL); //  -999999; ask Dr Jacob what it means
	this.nott = []; //array of booleans of size _nActions
	


	for(var i = 0; i < _nActions; i++)
	{
		this.ms.push(1.0/_nActions);
	}

	this.delete_minimaxLog = function()
	{
		// this function stands for ~minimaxLog
		this.ms = [];
		this.mpi = [];
		this.nott = []
	}
	
	this.getMinimax = function(nActions, me, payoff)
	{
		// first check for a pure strategy solution
		if(this.pureStrategy(this.mpi, nActions, me, payoff))
		{
			console.log("pure strategy solution");
			this.mv = this.evaluatePolicy(nActions, this.mpi, payoff, me);
			for(var i = 0; i < nActions[me]; i++)
			{
				this.ms[i] = this.mpi[i];
			}
		}
		else
		{
			this.mv = -Math.abs(this.SENTINAL); // -99999; // -abs[sentinal] should be here
			this.policyIterations(this.mpi, nActions, me, payoff, 1.0, 0, 0.0, 1.0/nActions[me], 1.0);
		}
	}

	this.policyIterations = function(mpi, nActions, me, payoff, remaining, index, l, m , r)
	{
		if((nActions[me] - index) == 2)
		{
			var tmp = this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, l, m, r);
			if(tmp > this.mv)
			{
				this.mv = tmp;

				for(var i = 0; i < nActions[me]; i++)
				{
					this.ms[i] = mpi[i];
				}
			}
				return tmp;
		}
		else if(remaining <= 0.0)
		{
			for(var i = index; i < nActions[me]; i++)
			{
				mpi[i] = 0.0;
			}
			var tmp = this.evaluatePolicy(nActions, mpi, payoff, me);
			if(tmp > this.mv)
			{
				this.mv = tmp;
				for(var i = 0; i < nActions[me]; i++)
				{
					this.ms[i] = mpi[i];
				}
			}
			return tmp;
		}

		var Val = [];
		var right;

		mpi[index] = i; //(remaining - 1);
		right = remaining - mpi[index];
		Val[0] = this.policyIterations(mpi, nActions, me, payoff, remaining-mpi[index], index+1, 0.0, right/(nActions[me] - (index + 1)), right);
		mpi[index] = m; // (remaining - m)
		right = remaining - mpi[index];
		Val[1] = this.policyIterations(mpi, nActions, me, payoff, remaining - mpi[index], index + 1, 0.0, right/(nActions[me] - (index + 1)), right);
		mpi[index] = r; // (remaining - r)
		right = remaining - mpi[index];
		Val[2] = this.policyIterations(mpi, nActions, me, payoff, remaining - mpi[index], index + 1, 0.0, right/(nActions[me] - (index + 1)), right);
		var order = [];
		this.getOrder(Val[0], Val[1], Val[2], order);
		if((r - 1) < this.GRANULARITY ) //what is GRANULARITY
		{
			return Val[order[0]];
		}
		
		if(order[0] == 0)
		{
			return this.policyIterations(mpi, nActions, me, payoff, remaining, index, 1, (m - 1)/(nActions[me] - index) + 1, m);
		}
		else if(order[0] == 2)
		{
			return this.policyIterations(mpi, nActions, me, payoff, remaining, index, m, (r -m)/(nActions[me] - index) + m, r);
		}
		else
		{
			// check the quarter points
			var lq, rq;
			mpi[index] = ((m - 1) / (nActions[me] - (index + 1))) + 1;
			right = remaining - mpi[index];
			lq = this.policyIterations(mpi, nActions, me, payoff, remaining - mpi[index], index + 1, 0.0, right/(nActions[me] - (index + 1)), right);
			if(lq > Val[1])
			{
				return this.policyIterations(mpi, nActions, me, payoff, remaining, index, 1, (m -1)/(nActions[me] - index) + 1, m);
			}

			mpi[index] = (( r - m) / (nActions[me] - (index + 1))) + m;
			right = remaining - mpi[index];
			rq = this.policyIterations(mpi, nActions, me, payoff, remaining - mpi[index], index + 1, 0.0, right/(nActions[me] - (index + 1)), right);
			if(rq > Val[1])
			{
				return policyIterations(mpi, nActions, me, payoff, remaining, index, m, (r-m)/(nActions[me] - index) + m, r);
			}

			return this.policyIterations(mpi, nActions, me, payoff, remaining, index, (m - 1)/(nActions[me] - index) + 1, m, (r - m)/ (nActions[me] - index) + m);
		}		

	}

	this.getDimensionHigh = function(mpi, nActions, me, payoff, index, remaining, l, m , r)
	{
		var Val = [];
		mpi[index] = remaining - 1;
		mpi[index + 1] = remaining - mpi[index];
		Val[0] = this.evaluatePolicy(nActions, mpi, payoff, me);
		mpi[index] = remaining - m ;
		mpi[index + 1] = remaining - mpi[index];
		Val[1] = this.evaluatePolicy(nActions, mpi, payoff, me);

		mpi[index] = remaining - r;
		mpi[index + 1] = remaining - mpi[index];
		Val[2] = this.evaluatePolicy(nActions, mpi, payoff, me);

		var order = [];
		this.getOrder(Val[0], Val[1], Val[2], order);

		if((r - 1) < this.GRANULARITY) //check for granularity
		{
			if(order[0] == 0)
			{
				mpi[index] = remaining - 1;
				mpi[index + 1] = remaining - mpi[index];
			}
			else if(order[0] == 1)
			{
				mpi[index] = remaining - m;
				mpi[index + 1] = remaining - mpi[index];
			}

			return Val[order[0]];
		}

		if(order[0] == 0)
		{
			return this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, 1, (m + 1)/2.0, m);
		}
		else if(order[0] == 2)
		{
			return this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, m, (m+r)/2.0, r);
		}
		else
		{
			// check the quarter points
			var lq, rq;

			mpi[index] = remaining - ((m + 1)/ 2.0);
			mpi[index + 1] = remaining - mpi[index];
			lq = this.evaluatePolicy(nActions, mpi, payoff, me);

			if(lq > Val[1])
			{
				return this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, 1, (m+1)/2.0, m);
			}

			mpi[index] = remaining - ((m + r) / 2.0);
			mpi[index + 1] = remaining - mpi[index];
			rq = this.evaluatePolicy(nActions, mpi, payoff, me);

			if(rq > Val[1])
			{
				return this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, m, (m+r)/2.0, r);
			}
		return this.getDimensionHigh(mpi, nActions, me, payoff, index, remaining, (1 + m)/2.0, m, (r + m)/2.0);
		}
	}

	this.getOrder = function(lVal, mVal, rVal, order)
	{
		if(lVal > mVal)
		{
			if(lVal > rVal)
			{
				order[0] = 0;
				if(rVal > mVal)
				{
					order[1] = 2;
					order[2] = 1;
				}
				else
				{
					order[1] = 1;
					order[2] = 2;
				}
			}
			else
			{
				order[0] = 2;
				order[1] = 0;
				order[2] = 1;
			}
		}
		else
		{
			if(mVal > rVal)
			{
				order[0] = 1;
				if(rVal > lVal)
				{
					order[1] = 2;
					order[2] = 0;
				}
				else
				{
					order[1] = 0;
					order[2] = 2;
				}
			}
			else
			{
				order[0] = 2;
				order[1] = 1;
				order[2] = 0;
			}
		}
	}

	this.evaluatePolicy = function(nActions, mpi, payoff, me)
	{
		var i, j , s;
		var V;
		var min = Math.abs(this.SENTINAL);
		// console.log("here");
		for(i = 0; i < nActions[1-me]; i++)
		{
			// console.log("here 2");
			V = 0.0;
			// console.log("here 1");
			for(j = 0; j < nActions[me]; j++)
			{
				if(me == 1)
				{
					s = i * nActions[1] + j;
				}
				else
				{
					s = j * nActions[1] + i;
				}
				// console.log("it is here");
				if(payoff[s] == -Math.abs(this.SENTINAL))
				{
					// console.log("something is wrong");
					V += 999999.0 * mpi[j]; // changes this eventually?
				}
				else
				{
					// console.log("it happened here");
					// console.log("payoff " + payoff[s]);
					// console.log("mpi " + mpi[j]);
					V += payoff[s] * mpi[j];
				}
			}

			// console.log("V is " + V);
			if(V < min)
			{
				// console.log("it is less");
				min = V;
			}
		}
		return min;
	}	

	// Stuff for pure strategy checks;

	this.highest = function(index, nActions, payoff, me, nott)
	{
		var i, altito, s;
		if(me == 0)
		{
			s = index;
		}
		else
		{
			s = index * nActions[1];
		}
		// console.log("s is " + s + " and me is " + me);

		altito = payoff[s];
		// console.log("altito " + altito);	
		for(i = 1; i < nActions[me]; i++)
		{
			if(me == 0)
			{
				s = i * nActions[1] + index;
			}
			else
			{
				s = index * nActions[1] + i;
			}

			// console.log("second s is " + s);
			if(payoff[s] > altito)
			{
				altito = payoff[s];
			}
		}

		var rval = false;
		for(i=0; i < nActions[me]; i++)
		{
			if(me == 0)
			{
				s = i * nActions[1] + index;
			}

			else
			{
				s = index * nActions[1] + i;
			}

			if(payoff[s] < altito)
			{
				nott[i] = true;
			}
			else if(!nott[i])
			{
				rval = true;
			}
		}
		// console.log("rval is " + rval);
		return rval;
	}

	this.pureStrategy = function(mpi, nActions, me, payoff)
	{
		var i;
		for(i = 0; i < nActions[me]; i++)
		{
			this.nott[i] = false;
		}
		this.highest(0, nActions, payoff, me, this.nott);
		for(i = 1; i < nActions[1 - me]; i++)
		{
			if(!this.highest(i, nActions, payoff, me, this.nott))
			{
				return false;
			}
		}

		for(i = 0; i < nActions[me]; i++)
		{
			mpi[i] = 0.0;
		}

		var sum = 0.0;
		for(i = 0; i < nActions[me]; i++)
		{
			if(!this.nott[i])
			{
				mpi[i] = 1.0;
				sum = sum + 1;
			}
		}

		for(i = 0; i < nActions[me]; i++)
		{
			mpi[i] = mpi[i]/sum;
		}
		return true;
	}
}

module.exports = minimax;

// var myminimax = new minimax(2);
// var payoff = [0.6 , 1.0, 0, 0.2] ; //, [0, 0, 1.0, 0.2]];
// var nActions = [2, 2];
// myminimax.getMinimax(nActions, 1, payoff);
// var mini = myminimax.mv;
// var midi = myminimax.ms;
// console.log(mini);
// console.log("midi " + midi);
// this.getMinimax = function(nActions, me, payoff)
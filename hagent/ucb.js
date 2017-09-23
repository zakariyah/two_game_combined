var ucb = function(_me, _lambda, _numExperts)
{
	this.expertName = 'ucb';
	this.me = _me;
	this.numExperts = _numExperts;
	this.lambda = _lambda;

	this.x = [];
	this.n = [];

	for(var i = 0; i < this.numExperts; i++)
	{
		this.n[i] = 0.0;
		this.x[i] = 0.0;
	}
	this.num = 0;
	this.t = 0;
	this.experto = -1;

	this.select = function(choices)
	{
		if(this.t == 0)
		{
			this.experto = this.randomlySelect(choices);
			return this.experto;
		}

		var left = [];
		var numLeft = 0;
		for(var i = 0; i < this.numExperts; i++)
		{
			if((this.n[i] == 0) && choices[i])
			{
				left[i] = true;
				numLeft ++;
			}
			else
			{
				left[i] = false;
			}
		}

		if(numLeft != 0)
		{
			var highestNumber = Math.pow(2, 53);
			this.experto = Math.floor(Math.random() * highestNumber) % this.numExperts; //not sure
			while(!left[this.experto])
			{
				this.experto = Math.floor(Math.random() * highestNumber) % this.numExperts;
			}

			return this.experto;
		}

		this.experto = -1;
		var best = -99999;
		var val;

		for(var i = 0; i < this.numExperts; i++)
		{
			if(choices[i])
			{
				val = (this.x[i] / this.n[i]) + Math.sqrt(2.0 * Math.log(this.num) /this.n[i]);
				var oneOrZero  = Math.floor((Math.random()) + 0.5);

				if((val > best) || ((val == best) && (oneOrZero)))
				{
					this.experto = i;
					best  = val;
				}
			}
		}

		return this.experto;
	}

	this.randomlySelect = function(choices)
	{
		var cnt = 0;
		for(var i = 0; i < this.numExperts; i++)
		{
			if(choices[i])
			{
				cnt ++;
			}
		}

		var highestNumber = Math.pow(2, 53);
		var pick = Math.floor(Math.random() * highestNumber) % cnt;
		cnt = 0;
		for(var i = 0; i < this.numExperts; i++)
		{
			if(choices[i])
			{
				if(cnt == pick)
				{
					return i;
				}
				cnt ++;
			}
		}

		console.log("we have a problem ucb");

		return -1;
	}

	this.update = function(R, tau)
	{
		var aspiration = 0;
		for(var i = 0; i < tau; i++)
		{
			aspiration = this.lambda * aspiration + (1.0 - this.lambda) * R;
		}

		this.x[this.experto] += R * tau;
		this.n[this.experto] += tau;
		this.num += tau;
		this.t ++;
	}

}
var Exp3 = function(_me, _T, _lambda, _numExperts)
{
	this.expertName = 'Exp3';
	this.K = _numExperts;
	this.me = _me;
	this.lambda = _lambda;
	this.G = [];
	this.pt = [];
	this.lambdita = Math.sqrt((this.K + Math.log(this.K))/ ((2.7183 - 1) * _T));
	if(this.lambdita > 1.0)
	{
		this.lambdita = 1.0;
	}
	// console.log("lambdita " + this.lambdita);
	this.eta = this.lambdita / this.K;
	console.log("eta " + this.eta);

	for(var i = 0; i < this.K; i++)
	{
		this.G[i] = 0.0;
	}

	this.t = 0;

	// console.log("numExpert " + this.K);

	this.select = function(choices)
	{
		var sum = 0.0;
		var Kcount = 0;
		for(var i = 0; i < this.K; i++)
		{
			if(choices[i])
			{
				sum = sum + Math.exp(this.eta * this.G[i]);
				Kcount = Kcount + 1;
			}
		}

		for(var i = 0; i < this.K; i++)
		{
			if(choices[i])
			{
				this.pt[i] = (1.0 - this.lambdita) * (Math.exp(this.eta * this.G[i]) / sum) + (this.lambdita / Kcount);
			}
			else
			{
				this.pt[i] = 0.0;
			}
		}

		this.t = this.t + 1;
		this.experto = this.pickExpert();
		return this.experto;
	}

	this.pickExpert = function()
	{
		var highestNumber = Math.pow(2, 53);
		// var num = Math.floor(Math.random() * highestNumber) % highestNumber; //not sure
		var num = Math.random();
		var sum = 0.0;
		for(var i = 0; i < this.K; i++)
		{
			sum = sum + this.pt[i] * highestNumber; // not sure
			if(num < sum)
			{
				return i;
			}
		}

		// console.log("I never selected an action: num = " + num);
		throw new Error();
		return -1;
	}

	this.update = function(R, tau)
	{
		var aspiration = 0;
		for(var i = 0; i < tau; i++)
		{
			this.G[this.experto] = this.G[this.experto] + R/this.pt[this.experto];
			aspiration = this.lambda * aspiration + (1.0 - this.lambda) * R;
		}
	}
}
var a = function(_me, _A, _M, _lambda, _numExperts)
{  // used to select the expert to use amongst various experts
	this.expertName = 'a';
	this.me = _me;
	this.numExperts = _numExperts;
	this.lambda = _lambda;
	this.lastExpert = -1;
	this.rho;
	this.aspiration = 0.0;
	// console.log("a was used");

	this.select = function(choices)
	{
		if(this.lastExpert == -1)
		{
			this.lastExpert = this.randomlySelect(choices);
		}
		else
		{
			if(!choices[this.lastExpert])
			{
				this.rho = -1.0; // takes care of override
			}
			// var highestNumber = Math.pow(2, 53);
			// console.log("rho is " + this.rho);
			var num = Math.random();

			if(num > this.rho)
			{
				this.lastExpert = this.randomlySelect(choices);
			}
		}
		return this.lastExpert;
	}

	this.randomlySelect = function(choices)
	{
		var i;
		var cnt = 0;
		for(i = 0; i < this.numExperts; i++)
		{
			if(choices[i])
			{
				cnt = cnt + 1;
			}
		}

		if(cnt == 0)
		{
			console.log("no choices aspiration " + this.aspiration);
		}

		var highestNumber = 37572;
		var pick = Math.floor(Math.random() * highestNumber) % cnt;
		cnt = 0;

		for( i = 0; i < this.numExperts; i++)
		{
			if(choices[i])
			{
				if(cnt == pick)
				{
					return i;
				}
				cnt = cnt + 1;
			}
		}

		console.log("we have a problem");
		throw new Error("Something is wrong");
		return -1;
	}

	this.update = function(R, tau)
	{
		// var aspiration = 0;
		// console.log('R is ' + R);
		// console.log('Tau is ' + tau);
		// console.log('lambda is ' + this.lambda);
		// console.log('Aspiration before is ' + this.aspiration);
		for(var i = 0; i < tau; i++)
		{
			this.aspiration = this.lambda * this.aspiration + (1.0 - this.lambda) * R;
		}

		// console.log('Aspiration is ' + this.aspiration);

		this.rho = R / this.aspiration;
		if(this.rho > 1.0)
		{
			this.rho = 1.0;
		}

		this.rho = Math.pow(this.rho, tau);
	}
}

module.exports = a;
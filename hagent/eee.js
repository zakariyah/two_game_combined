var eee = function(_me, _lambda, _numExperts)
{
	this.expertName = 'eee';
	this.me = _me;
	this.numExperts = _numExperts;
	this.lambda = _lambda;

	this.M_e = [];
	this.N_e = [];
	this.S_e = [];
	for(var i = 0; i < this.numExperts; i++)
	{
		this.N_e[i] = 0;
		this.M_e = 0.0;
		this.S_e = 0.0;
	}
	this.t = 0;
	this.experto = -1;

	this.select = function(choices)
	{
		if(this.t == 0)
		{
			this.experto = this.randomlySelect(choices);
		}
		else
		{
			var prob = 0.1;
			var num = Math.random();
			if(num < prob)
			{
				this.experto = this.randomlySelect(choices);
			}
			else
			{
				var best = -99999;
				this.experto = -1;
				var bestCount = 0;
				for(var i = 0; i < this.numExperts; i++)
				{
					if(this.choices[i])
					{
						if(this.M_e[i] > best)
						{
							best = this.M_e[i];
							this.experto = i;
							bestCount = 1;
						}
						else if(this.M_e[i] == best)
						{
							bestCount ++;						
						}
					}
				}

				if(bestCount > 1)
				{
					var highestNumber = Math.pow(2, 53);
					var num2 = Math.floor(Math.random() * highestNumber) % bestCount;
					var c = 0;
					for(var i = 0; i < this.numExperts; i++)
					{
						if((this.M_e[i] == best) && choices[i])
						{
							c ++;
						}

						if(c > num2)
						{
							this.experto = i;
							break;
						}
					} 
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

		// console.log("we have a problem eee.js");

		return -1;
	}

	this.update = function(R, tau)
	{
		var aspiration = 0;
		for(var i =0 ; i < tau; i++)
		{
			aspiration = this.lambda * aspiration + (1.0 - this.lambda) * R;
		}
		this.N_e[this.experto] = this.N_e[this.experto] + 1 ; 
		this.S_e[this.experto] = this.S_e[this.experto] + tau;
		this.M_e[this.experto] = this.M_e[this.experto] + ((tau/ this.S_e[this.experto] ) * (R - this.M_e[this.experto]));

		this.t ++;		
	}

}
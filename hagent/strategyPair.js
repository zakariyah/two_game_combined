var strategyPair = function(_me, _M, _A, _acts, s1, s2, assessment)
{
	this.me = _me;
	this.numStates = _A[0] * _A[1];
	this.teacher = [];
	this.follower = [];

	for(var i = 0; i < this.numStates; i++)
	{
		this.teacher[i] = [];
		this.follower[i] = [];
	}

	for(var i = 0; i < this.numStates; i++)
	{
		for(var j = 0; j < _A[1 - this.me]; j++)
		{
			this.follower[i][j] = 0.0;
		}
		if(i == s1)
			this.follower[i][_acts[1 - this.me][1]] = 1.0;
		else if(i == s2)
			this.follower[i][_acts[1 - this.me][0]] = 1.0;
		else
		{
			this.follower[i][_acts[1 - this.me][0]] += 0.5;
			this.follower[i][_acts[1 - this.me][1]] += 0.5;
		}
	}

	 var sum;
	 for(var i = 0; i < this.numStates; i++)
	 {
	 	sum = 0;
	 	for(var j = 0; j < _A[this.me]; j++)
	 		sum += assessment[i][j];

	 	for(var j = 0; j < _A[this.me]; j++)
	 		this.teacher[i][j] = assessment[i][j] / sum;
	 }

	this.isTeacher = function(_me)
	{
		if(this.me == _me)
		{
			return true;
		}
		return false;
	}
}

module.exports = strategyPair;
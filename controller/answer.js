var answer = function(value) // give the matrix as a 4 by 4 array e.g (A, B, 1, 5)
{
	if(value == 0)
	{
		this.chosenAnswer  = Math.floor(Math.random() * 2) + 1;
		this.answerType = 0;  // response trigerred after a period of inactivity: Random value generated
	}
	else
	{
		this.chosenAnswer  = value;
		this.answerType =  1;
	}
};

module.exports = answer;
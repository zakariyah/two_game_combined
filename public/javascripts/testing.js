var AgentStateInfos = function()
{
	var distinctExpertWasChosen, anExpertHasBeenExecutedForCompleteCycle, profitedFromDefection;
	var expertType, aspiration, target, targetForOpponent;
	this.setStates = function(states)
	{
		distinctExpertWasChosen = states[0];
		anExpertHasBeenExecutedForCompleteCycle  = states[1];
		profitedFromDefection = states[2];
		expertType = states[3];
		aspiration = states[4];
		target = states[5];
		targetForOpponent = states[6];
	}

	this.getStatesText = function(states, recommendation, lineNumber)
	{
		
		if(!states)
		{
			return '';
		}
		this.setStates(states);
		var stateText = 'Line ' + lineNumber + ': ' ; //<p>';
		if(distinctExpertWasChosen)
		{
			stateText += 'A distinct expert has been chosen. ';
		}
		if(anExpertHasBeenExecutedForCompleteCycle)
		{
			stateText += 'The expert has executed a complete cycle. ';
		}
		if(profitedFromDefection)
		{
			stateText += 'The opponent profited from the defection and is thus guilty. ';
		}

		var options = ['A', 'B'];
		stateText += ' Expert Type ' + expertType + '. ';
		if(aspiration)
		{
			aspiration = aspiration.toFixed(3);
		}
		stateText += ' Aspiration ' + aspiration + '. ';
		stateText += ' Target ' + target + '. ';
		stateText += ' Target for opponent ' + targetForOpponent + '. ';
		stateText += ' Recommended action : ' + options[recommendation] + ' ';
		stateText += '';

		
		return stateText;
	}
}

var Testing = function()
{	
	
	var showPage = document.getElementById('showGame');
	var gameButton = document.getElementById('playGame');
	// var socket = io.connect('http://localhost:4000');
	var socket = io.connect('http://ec2-52-88-237-252.us-west-2.compute.amazonaws.com:4000/');

	var playGameOnClick = function()
	{
		var secondAgent = document.getElementById('secondAgent').value;
		var probability = document.getElementById('probability').value;
		if(!isNumber(probability))
		{
			alert('probability is not a number between 0 and 1');
			return;
		}
		if(probability > 1 || probability < 0)
		{
			alert('probability is not a number between 0 and 1');
			return;	
		}
		socket.emit('playGame', [secondAgent, probability]);	
	}
	

	var isNumber = function(n) 
	{
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var getHtmlFromLine = function(line, lineNumber)
	{	
		var recObject = line[5];
		
		var agentVariables = recObject.agentVariables;
		var agentChoice = recObject.agentChoice;
		
		var title = getRecommendationStateText(agentVariables, agentChoice, lineNumber);
		
		var options = ['A', 'B'];
		// title = 'here this';
		var html = '<tr data-toggle="tooltip" title="' + title + '">';
		html += '<td>' + lineNumber + '</td>';
		html += '<td>' + options[line[4]] + '</td>';
		html += '<td>' + options[line[0]] + '</td>';
		html += '<td>' + options[line[1]] + '</td>';
		// html += '<td>' + line[2] + '</td>';
		// html += '<td>' + line[3] + '</td>';
		

		
		var doBetter = recObject.doBetter;
		var reason = recObject.reason;
		var recommendation = recObject.recommendation;
		var opponentInfo = recObject.opponentInfo;
		var reasonOtherwise = recObject.reasonOtherwise;

		html += '<td><p>' + recommendation.join('</p><p>') + '</p></td>';
		html += '<td><p>' + reason.join('</p><p>') + '</p></td>';
		html += '<td><p>' + reasonOtherwise.join('</p><p>') + '</p></td>';
		html += '<td><p>' + opponentInfo.join('</p><p>') + '</p></td>';
		html += '<td><p>' + doBetter.join('</p><p>') + '</p></td>';
		
		
		html += '</tr>';
		return html;
	}

	var getRecommendationStateText = function(agentVariables, recommendation, lineNumber)
	{
		return (new AgentStateInfos()).getStatesText(agentVariables, recommendation, lineNumber);
	}

	var getHtmlFromContent = function(content)
	{
		
		var contentHtml = '<table class="table table-bordered">';
		contentHtml += '<tr><th>Round No</th><th>Reco for A</th><th>choice A</th><th>Choice B</th>';
		contentHtml += '<th>Reco Text</th><th>Reason</th><th>Reason not</th><th>opponentInfo</th><th>do doBetter</th></tr>';
		for(var i = 0; i < content.length; i++)
		{
			var line = content[i];
			contentHtml += getHtmlFromLine(line, (i+1));			
		}

		contentHtml += '</table>';
		return contentHtml;
	}

	var initAllTooltips = function()
	{
		$('[data-toggle="tooltip"]').tooltip();
		
	}

	var showGame = function(content)
	{	
		var contentHtml = getHtmlFromContent(content);
		showPage.innerHTML = contentHtml;
		initAllTooltips();
	}

	socket.on('showGame', showGame);

	gameButton.onclick = playGameOnClick;
	
}
	

test = new Testing();
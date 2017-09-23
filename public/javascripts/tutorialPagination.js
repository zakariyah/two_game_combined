var ImageRect = function(imageRectId, numberOfPages)
{
	var imageDiv = document.getElementById(imageRectId);
	var pageNumber = 0;
	var imageLink = '../public/images/tutorial/';
	var extension = '.png';


	this.setImageToPage = function()
	{	
		var idToShow = 'page' +  (pageNumber + 1);
		// alert(idToShow);
		document.getElementById(idToShow).style.display = 'block';
		var idToLInkItem = 'linkItem' + (pageNumber + 1);
		document.getElementById(idToLInkItem).className = 'active';
	}

	this.unShowPage = function(pageNo)
	{
		if(pageNo == numberOfPages)
		{
			pageNo = numberOfPages - 1;
		}
		var idToShow = 'page' +  (pageNo + 1);
		document.getElementById(idToShow).style.display = 'none';
		var idToLInkItem = 'linkItem' + (pageNo + 1);
		document.getElementById(idToLInkItem).className = 'disabled';
	}

	this.showPage = function(pageNo)
	{
		// alert(pageNo);
		this.unShowPage(pageNumber);
		pageNumber = pageNo;
		this.setImageToPage();
	}

	this.showNextPage = function()
	{
		this.unShowPage(pageNumber);
		pageNumber += 1;
		if(pageNumber > numberOfPages - 1)
		{
			pageNumber = numberOfPages - 1;
		}
		this.setImageToPage();
	}

	this.showPreviousPage = function()
	{
		this.unShowPage(pageNumber);
		pageNumber -= 1;
		if(pageNumber < 0)
		{
			pageNumber = 0;
		}
		this.setImageToPage();
	}

	this.setImageToPage();	
}

var PaginationPage = function(PaginationPageId, imageRectId, numberOfLinks, paginatorId)
{
	// get paginator html
	var buttonId = paginatorId + 'link';
	var paginatorHtml = "<nav><ul class='pagination'><li><a href='#' id='"+ buttonId  +"0' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
	for(var i = 0; i < numberOfLinks; i++)
	{
		paginatorHtml += '<li id="linkItem' + (i+1) + '" '; 
		if(i==0)
		{
			paginatorHtml += ' class="active" ';
		}
		else
		{
			paginatorHtml += ' class="disabled" ';
		}
		paginatorHtml += '><a href="#" id="' + buttonId + (i+1) + '">' + (i+ 1) + '</a></li>';
	}	
	paginatorHtml += "  <li><a href='#' id='"+ buttonId  + (numberOfLinks + 1) + "' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li></ul></nav>";

	document.getElementById(paginatorId).innerHTML = paginatorHtml;


	var imageRect = new ImageRect(imageRectId, numberOfLinks);


	// on click for the buttons
	var buttonOnClickToShowPage = function(buttonId)
	{
		if(buttonId >= 0 && buttonId <= numberOfLinks)
		{
				return function()
			{
				imageRect.showPage(buttonId);
			}	
		}
		else if(buttonId == -1)
		{
			return function()
			{
				imageRect.showPreviousPage();
			}
		}
		else
		{
			return function()
			{
				imageRect.showNextPage();
			}
		}
		


	}


	//validate the answers
	var validateAnswers = function()
	{	
		return function()
		{		
				return true; // testing purposes
				var confirmation = document.getElementById('confirmation');
	      		if(!(confirmation.checked))
	      		{
	        		alert("Please confirm that you accept the terms of the experiment on page 2");
	        		return false;
	      		}
	      		var correct = true;
	      		var correctAnswers = [-2, 0]
	      		for(var i = 0; i < 2; i++)
	      		{
	        		var value = -1;
	        		var radios = document.getElementsByName((i + 1) + "");
	        		for (var j = 0; j < radios.length; j++) {
	          			if (radios[j].checked) {
	          			// get value, set checked flag or do whatever you need to
	          			value = radios[j].value;       
	          			}
	        		}
	        		if(value != correctAnswers[i])
	        		{
		          		alert("Some of the answers are incorrect. Please read the tutorial properly and answer the questions");
		          		return false;
	        		}
	      		}
	      	return true;		
		}
	}


	for(var i = 0; i < numberOfLinks; i++)
	{
		document.getElementById(buttonId + (i+1)).onclick = buttonOnClickToShowPage(i);
	}

	document.getElementById(buttonId + (0)).onclick = buttonOnClickToShowPage(-1);
	document.getElementById(buttonId + (numberOfLinks+1)).onclick = buttonOnClickToShowPage(numberOfLinks+1);

	document.getElementById('submissionForm').onsubmit = validateAnswers();
}

paginationPage = new PaginationPage('PaginationPageId', 'imageRectId', 10, 'paginatorId');
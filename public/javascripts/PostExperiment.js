var Quiz = function(pageId, numberOfPages, previousButtonPresent, defaultSubmitButton, arrayOfNamesToCheckOnNext, pageTitles)
{
	var tracker = 0;
	var pages = [];
	var nextButton = document.getElementById(pageId + 'next');
	var previousButton = false;
	var submitButton = false; //document.getElementById(pageId + 'submit');
	
	var isOneChecked = function(elementsName)
	{
		var elems = document.getElementsByName(elementsName);
		for(var i in elems)
		{
			if(elems[i].checked)
			{
				return true;
			}
		}
		return false;
	}

	if(defaultSubmitButton)
	{
		submitButton = document.getElementById(pageId + 'submit');
	}

	if(previousButtonPresent)
	{
		previousButton = document.getElementById(pageId + 'previous');
	}

	for(var i = 0; i < numberOfPages; i++)
	{
		pages.push(document.getElementById(pageId + (i + 1)));
	}

	var showPage = function()
	{
		pages[tracker].style.display = 'block';
		if(pageTitles)
		{
			document.getElementById(pageId + 'header').innerHTML = pageTitles[tracker];
		}
	}

	var canMoveOn = function(trackerVal)
	{
		var names = arrayOfNamesToCheckOnNext[trackerVal];
		for(var i in  names)
		{
			if(!isOneChecked(names[i]))
			{
				return false;
			}
		}
		return true;
	}

	var moveToNextPage = function(direction)
	{
		return function()
		{	
			if(!previousButton)
			{
				if(!canMoveOn(tracker))
				{
					alert('Please answer all questions before proceeding');
					return
				}
			}

			pages[tracker].style.display = 'none';
			tracker += direction;
			showPage();	
			if(!previousButton)
			{
				if(tracker >= numberOfPages - 1)
				{
					nextButton.style.display = 'none';
					if(submitButton)
					{
						submitButton.style.display = 'inline';	
					}
				}
			}
			else
			{
				if(tracker <= 0)
				{
					previousButton.style.display = 'none';
					nextButton.style.display = 'inline';
					if(submitButton)
					{
						submitButton.style.display = 'none';
					}
				}
				else if(tracker >= numberOfPages - 1)
				{
					previousButton.style.display = 'inline';
					nextButton.style.display = 'none';
					if(submitButton)
					{
						submitButton.style.display = 'inline';
					}
				}
				else
				{
					previousButton.style.display = 'inline';
					nextButton.style.display = 'inline';
					if(submitButton)
					{
						submitButton.style.display = 'none';
					}
				}
			}
		}
		
	}

	nextButton.onclick = moveToNextPage(1);
	previousButton.onclick = moveToNextPage(-1);
}
document.addEventListener('DOMContentLoaded', function() {
	var grab = document.getElementById.bind(document);
	//references for important dom objects
	var container = grab('result-container');
	var sortAll = grab('sort-all');
	var sortOnline = grab('sort-online');
	var sortOffline = grab('sort-offline');
	var addChannel = grab('add-channel');
	var buttons = document.getElementsByClassName('btn');

	var APIPrefix = 'https://api.twitch.tv/kraken/channels/';

	//maintain a list of all channels displayed so far
	var displayed = [];

	//list of channels to autoload
	var preloads = ["freecodecamp", "storbeck",  
		"habathcx","RobotCaleb","noobs2ninjas"];

	//preload
	for (var i = 0; i < preloads.length; i++) 
		makeRequest(preloads[i]);

	//give focus to addChannel
	addChannel.focus();

	//helper fn - returns boolean based on if channel 
	//is currently displayed on page
	function isDisplayed(channel) {
		return (displayed.indexOf(channel) !== -1);
	}

	//handle text requests
	addChannel.onkeyup = function (event) {
		if (event.key === 'Enter') {
			if (this.value !== '' && !isDisplayed(this.value)) {
				//check the api for the channel
				makeRequest(this.value);
			}
			//add this attempt to displayed, even if it's bogus
			displayed.push(this.value);
			//no matter what, clear the box
			this.value = ''; 
		}
	}

	//loads and sends twitchRequest with channelName
	function makeRequest(channelName) {
		var twitchRequest = new XMLHttpRequest();

		twitchRequest.onload = function() {
			if (twitchRequest.status >= 200 && twitchRequest.status <= 400) {
				console.log('success! rec\'d: ' + twitchRequest.responseText);
				populate(JSON.parse(twitchRequest.responseText));
			} else  {
				//let the user know
				alert('Channel wasn\'t found on Twitch.tv.');
				console.log('fail?! rec\'d: ' + twitchRequest.responseText);
			}
		}
	
			twitchRequest.open('GET', APIPrefix + channelName);
			twitchRequest.send();
			console.log('request sent');
	}

			

	//adds a successfully found channel to the page
	function populate(data) {
		console.log('contains keys: ' + Object.keys(data));
		console.log('populating');

		//a link to the channel to wrap the containing div in
		var channelLink = document.createElement('a');
		channelLink.href = data.url;

		//the container for the data
		var infoDiv = document.createElement('div');
		infoDiv.classList.add('infoDiv');
		channelLink.appendChild(infoDiv);

		//subcontainer for the user pic
		var userPic = document.createElement('div');
		userPic.classList.add('userPic');
		userPic.style['background-image'] = (data.logo) ? 'url(' + data.logo + ')':
				'url(\'assets/question.png\')';
		infoDiv.appendChild(userPic);

		//subcontainer for the channel name
		var name = document.createElement('h3');
		name.classList.add('userName');
		name.textContent = data.name;
		infoDiv.appendChild(name);

		//subcontainer for the channel status
		var userStatus = document.createElement('p');
		userStatus.classList.add('userStatus');
		userStatus.textContent = data.status;
		infoDiv.appendChild(userStatus);

		//add new elements to document
		container.appendChild(channelLink);
	}

});

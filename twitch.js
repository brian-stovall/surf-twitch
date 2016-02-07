document.addEventListener('DOMContentLoaded', function() {
	var grab = document.getElementById.bind(document);
	//references for important dom objects
	var container = grab('result-container');
	var sortAll = grab('sort-all');
	var sortOnline = grab('sort-online');
	var sortOffline = grab('sort-offline');
	var addChannel = grab('add-channel');

	var buttons = document.getElementsByClassName('btn');

	//holders for dynamically generated elements
	var onlineStreams;
	var offlineStreams;
	
	var twitchRequest = new XMLHttpRequest();
	var APIPrefix = 'https://api.twitch.tv/kraken/channels/';

	addChannel.onkeyup = function (event) {
		if (event.key === 'Enter') {
			twitchRequest.open('GET', APIPrefix + this.value);
			twitchRequest.send();
			console.log('request sent');
		}
	}
			
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

	//adds a successfully found channel to the page
	function populate(data) {
		console.log('contains keys: ' + Object.keys(data));
		console.log('populating');
		//a link to the channel to wrap the containing div in
		var channelLink = document.createElement('a');

		channelLink.href = data.url;
		var infoDiv = document.createElement('div');
		infoDiv.classList.add('infoDiv');
		infoDiv.textContent = data.name;
		channelLink.appendChild(infoDiv);
		container.appendChild(channelLink);
	}

});

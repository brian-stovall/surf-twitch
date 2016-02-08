document.addEventListener('DOMContentLoaded', function() {
	var grab = document.getElementById.bind(document);
	//references for important dom objects
	var container = grab('result-container');
	var sortAll = grab('sort-all');
	var sortOnline = grab('sort-online');
	var sortOffline = grab('sort-offline');
	var addChannel = grab('add-channel');
	var buttons = document.getElementsByClassName('btn');

	var channelPrefix = 'https://api.twitch.tv/kraken/channels/';
	var streamPrefix = 'https://api.twitch.tv/kraken/streams/';

	//maintain a list of displayed channel names
	var displayed = [];

	//list of channels to autoload
	var preloads = ['esl_sc2', "freecodecamp", "storbeck",  
		"habathcx","RobotCaleb","noobs2ninjas"];

	//preload function
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

	//set event handlers for buttons
	sortAll.onclick = function() {
		toggleButtons(this);
		var infoDivs = document.getElementsByClassName('infoDiv');
		for (i = 0; i < infoDivs.length; i++) 
			infoDivs[i].style.display = 'block';
	};

	sortOnline.onclick = function() {
		toggleButtons(this);
		var infoDivs = document.getElementsByClassName('infoDiv');
		for (i = 0; i < infoDivs.length; i++) 
			infoDivs[i].style.display = (infoDivs[i].isStreaming) ?
				'block' : 'none';
	};

	sortOffline.onclick = function() {
		toggleButtons(this);
		var infoDivs = document.getElementsByClassName('infoDiv');
		for (i = 0; i < infoDivs.length; i++) 
			infoDivs[i].style.display = (infoDivs[i].isStreaming) ?
				'none' : 'block';
	};

	//sets the passed button to btn-primary and the others to btn-default
	function toggleButtons(button) {
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i] === button) {
				buttons[i].classList.add('btn-primary');
				buttons[i].classList.remove('btn-default');
			} else {
				buttons[i].classList.remove('btn-primary');
				buttons[i].classList.add('btn-default');
			}
		};
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
				alert('channel wasn\'t found on Twitch.tv.');
				console.log('fail?! rec\'d: ' + twitchRequest.responseText);
			}
		}
	
			twitchRequest.open('GET', channelPrefix + channelName);
			twitchRequest.send();
			console.log('request sent');
	}

			

	//adds a successfully found channel to the page
	function populate(data) {
		console.log('contains keys: ' + Object.keys(data));
		console.log('populating');

		//first, get the stream data
		var streamRequest = new XMLHttpRequest();

		streamRequest.onload = function() {
			if (streamRequest.status >= 200 && streamRequest.status <= 400) {
				//go on with the data
				gotStreamData(JSON.parse(streamRequest.responseText));
			} else  {
				//go ahead without the data
				gotStreamData(null);
			}
		}
	
			streamRequest.open('GET', streamPrefix + data.name);
			streamRequest.send();
			console.log('stream request sent');

		

		//resume once we've gotten the data
		function gotStreamData(stream) {

			//the container for the data
			var infoDiv = document.createElement('div');
			infoDiv.classList.add('infoDiv');
			
			//link channel to wrap everything but div in
			var channelLink = document.createElement('a');
			channelLink.href = data.url;

			//subcontainer for the user pic
			var userPic = document.createElement('div');
			userPic.classList.add('userPic');
			userPic.style['background-image'] = (data.logo) ? 'url(' + data.logo + ')':
					'url(\'assets/question.png\')';
			channelLink.appendChild(userPic);

			//subcontainer that has a preview or just reads offline
			var previewPic = document.createElement('div');
			previewPic.classList.add('previewPic');

			//the channel is currently streaming
			if (stream && stream.stream) {
				previewPic.style['background-image'] = 
						'url(' + stream.stream.preview.large + ')';
				infoDiv.isStreaming = true;
				infoDiv.style['background-color'] = '#944';
			} else {
				//add h2 to previewPic that says 'offline'
				var offlineNote = document.createElement('h4');
				offlineNote.textContent='offline';
				previewPic.appendChild(offlineNote);
				infoDiv.isStreaming = false;
				infoDiv.style['background-color'] = 'grey';
			}
			channelLink.appendChild(previewPic);


			//subcontainer for the channel name
			var name = document.createElement('h3');
			name.classList.add('userName');
			name.textContent = data.name;
			channelLink.appendChild(name);

			//subcontainer for the channel status
			var userStatus = document.createElement('p');
			userStatus.classList.add('userStatus');
			userStatus.textContent = data.status;
			channelLink.appendChild(userStatus);

			//add new elements to document
			infoDiv.appendChild(channelLink);
			container.appendChild(infoDiv);
		}
	}

});

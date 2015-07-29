	//this includes a function, SendtoDB which can get all required fields from a person's data account, assuming that our application has a valid token
	//as far as I can tell, these tokens are persistent without them being physically stored
	// This is called with the results from from FB.getLoginStatus().
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			testAPI();
		}
		else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			document.getElementById('status').innerHTML = 'Please log ' +
				'into this app.';
		}
		else {

			document.getElementById('status').innerHTML = 'Please log ' +
				'into Facebook.';
		}
	}

	function checkLoginState() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId: '1681575828724744',
			cookie: true,
			xfbml: true,
			version: 'v2.4'
		});
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	};

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function testAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', {
			fields: 'email, name'
		}, function(response) {
			console.log(response);
			console.log('Successful login for: ' + response.name);
			console.log('Your email is,' + response.email);
			// document.getElementById('status').innerHTML =
			// 	'Thanks for logging in, ' + response.name + '! ' + 'Your email is ' + response.email + '!';
		});
	}

	function SendToDB() {
		console.log('Sending to DB');
		FB.api('/me', {
			fields: 'first_name, last_name, id, gender, age_range, picture, email'
		}, function(response) {
			var user = {
				"firstName": response.first_name,
				"lastName": response.last_name,
				"serviceID": response.id,
				"serviceName": "facebook",
				"gender": response.gender,
				"ageRange": response.age_range, //this has two parameters, max and min. If max = 17, they're a child, else, they're an adult
				"pictureURL": response.picture.data.url,
				"email": response.email //just added
			};

			var data = {
				"user": user,
				"matchDetails": {}
			};
			console.log(data);
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", "http://foc-2015-harjot1singh.c9.io/api/create", true);
			xmlHttp.onreadystatechange = function (response) {
				console.log("Data sent!");
			};
			xmlHttp.send(JSON.stringify(data));

		});
	}
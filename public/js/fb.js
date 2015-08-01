var user;
//Begin load fb api		
window.fbAsyncInit = function() {
	FB.init({
		appId: '1681575828724744',
		cookie: false,
		xfbml: true,
		status: true,
		version: 'v2.4'
	});
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_GB/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//End load fb api


function statusChangeCallback(response) {
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
	}
	else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		console.log('Please log ' +
			'into this app.');
		logInFB();
	}
	else {

		console.log('Please log ' +
			'into Facebook.');
		logInFB();
	}
}

function logInFB(success) {
	FB.login(function(response) {
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			success();
		}
		else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			console.log('Please log ' +
				'into this app.');
		}
		else {

			console.log('Please log ' +
				'into Facebook.');

		}
	}, {
		scope: "public_profile,email"
	});
}

function checkLoginState(callback) {
	console.log("Checking login status");
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			callback();
		}
		else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			console.log('Please log ' +
				'into this app.');
			logInFB(callback);
		}
		else {

			console.log('Please log ' +
				'into Facebook.');
			logInFB(callback);
		}
	});
}



function getFBInfo(callback) {
	console.log('Fetching user info');
	FB.api('/me', {
		fields: 'first_name, age_range, last_name, id, email'
	}, function(response) {
		user = {
			"firstName": response.first_name,
			"lastName": response.last_name,
			"serviceID": response.id,
			"serviceName": "facebook",
			"email": response.email, //just added
			//"verified": response.verified, //boolean - is account verified?
			"minAge": response.age_range.min, //this is a string in an american format (dern dern dern!)
			"maxAge": response.age_range.max,
		};
		callback();
	});
}
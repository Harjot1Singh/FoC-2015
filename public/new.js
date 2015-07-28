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
     console.log('Successful login for: ' + response.name);
     console.log('Your email is,' + response.email);
     document.getElementById('status').innerHTML =
       'Thanks for logging in, ' + response.name + '! ' + 'Your email is ' + response.email + '!';
   });
 }

 function SendToDB() {
   console.log('Fetching information for database...');
   FB.api('/me', {
     fields: 'first_name, last_name, id, gender, birthday, picture'
   }, function(response) {
     var DataToBeSent = {
       firstName: response.first_name,
       lastName: response.last_name,
       id: response.id,
       gender: response.gender,
       DOB: response.birthday,
       pictureURL: response.picture
     };
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.open("POST", URL_TBD, true);
     xmlHttp.onreadystatechange = callbackFunction;
     xmlHttp.send(JSON.stringify(DataToBeSent));

     function callbackFunction(response) {
       console.log("Data sent woop woop hype time.");
     }
   });
 }

 function getEmail() {
   FB.api('/user/1633802593558539', function(response) {
     console.log(response.email);
   })
 }
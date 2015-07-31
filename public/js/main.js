var userid
var selectedDate;
var userlat
var userlong
$(document).ready(function() {
    // Attach all event handlers here
    $(".loginbtn").click(function(e) {
        e.preventDefault();
        checkLoginState(); //initiate check for FB login status
        SendToDB(function(data){ //this will send the FB data package to the user database
            var userid = data.userID;
            sendRequest()
        });
        
        $(".loginbtn").css({
            "border-radius": "6px",
            "-webkit-animation-name": "changeBorderRadius",
            "-webkit-animation-duration": "1s",
            "animation-name": "changeBorderRadius",
            "animation-duration": "1s"
        });
    });
    // Datepicker options
    //~2 year max limit
    $(".datepicker").datepicker({
        showAnim: "fold",
        orientation: "top",
        startDate: "0d",
        endDate: "+731d",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        format: "D, d M yyyy"
    });

    // Date picker open and close
    var isDatePickerOpen = false;
    $(".datepicker").click(function(e) {
        e.preventDefault();
        if (isDatePickerOpen == true) {
            $(".datepicker").datepicker("hide");
            isDatePickerOpen = false;
        }
        else {
            $(".datepicker").datepicker("show");
            isDatePickerOpen = true;
        }
    });

    //Data picker temporary focus loss fix
    $(".calBtn").blur(function(e) {
        isDatePickerOpen = false;
    });
    //Set date when changed on calendar button
    $(".datepicker").on("changeDate", function(e) {
        selectedDate = $(".datepicker").datepicker("getDate");
        var day = selectedDate.getDate();
        var month = selectedDate.getMonth() + 1;
        var year = selectedDate.getFullYear();
        $(".calBtn").html(day + '/' + month + '/' + year);

        $(".calBtn").css({
            "border-radius": "6px",
            "-webkit-animation-name": "changeBorderRadius",
            "-webkit-animation-duration": "1s",
            "animation-name": "changeBorderRadius",
            "animation-duration": "1s"
        });
    });
    var activites;
    // Random placeholder for 'I want to' field
    $.getJSON("http://foc-2015-harjot1singh.c9.io/activity.json", function( data ) {
        activities = data.array;
        randomSuggestion();
        setInterval(randomSuggestion, 3000);
    });
    
    function randomSuggestion () {
        var random = Math.floor((Math.random() * activities.length));
        var activity = activities[random];
        $("#search").attr("placeholder", activity);
    }
    
    // Animate column change to show Map!!
    $(".locationbtn").click(function(e) {
        e.preventDefault();
    });
    
    $('#locationbtn').on('click', function () {
        toggleMap();
    });
    $('#closeMap').on('click', function () {
        toggleMap();
    });
    
    var isMapOpen = false;
    function toggleMap() {
        if ($(window).width() < 739) {
            // Small device
            $('#formCol').toggleClass('formColFull');
            $('#formCol').toggleClass('formColNone');
            $('#mapCol').toggleClass('mapColFull');
            $('#mapCol').toggleClass('mapColNone');
        } else {
            // Bigger devices
            if (isMapOpen == true) {
                isMapOpen = false;
                $('#mapCol').toggleClass('mapColNone');
                $('#mapCol').toggleClass('mapColHalf');
                setTimeout(function() {
                    $('#formCol').toggleClass('formColFull');
                    $('#formCol').toggleClass('formColHalf');
                }, 50);
            } else {
                isMapOpen = true;
                $('#formCol').toggleClass('formColFull');
                $('#formCol').toggleClass('formColHalf');
                setTimeout(function() {
                    $('#mapCol').toggleClass('mapColNone');
                    $('#mapCol').toggleClass('mapColHalf');
                }, 300);
            }
        }
    }
});

function sendRequest(){
    var pos = distanceWidget.get('position');
    var distance = String(parseFloat(distanceWidget.get('distance'))*0.621371192 );
    console.log(distance);
    console.log(pos);
    var publicAddress = "No address available"
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': pos}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            publicAddress = (results[1].formatted_address);
            return;
          }
        }
    });
    console.log(userid);
    var requestdata = {
        "activityName": $('.typeahead').val(),
        "number": $('.phonenofield').val(),
        "endDate": selectedDate,
        "userID": userid,
        "publicRadius": distance,
        "publicLatitude": pos.G,
        "publicLongitude": pos.K,
        "publicName": publicAddress,
    }
    $.ajax({
		url: 'http://foc-2015-harjot1singh.c9.io/api/request',
		type: 'POST',
        data: JSON.stringify(requestdata),
        contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			console.log(data);
			console.log("done request send!");
		},
		failure: function(data) {
			console.error("Error:", data);
			console.log("Something went wrong");
		}
	});
}
navigator.geolocation.getCurrentPosition(GetLocation);
function GetLocation(location) {
    userlat = location.coords.latitude;
    userlong = location.coords.longitude;
}
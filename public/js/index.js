var selectedDate;
var userid;
var userlat = 0;
var userlong = 0;
var activites;

$(document).ready(function() {


    // Random placeholder for 'I want to' field
    $.getJSON("http://foc-2015-harjot1singh.c9.io/activity.json", function(data) {
        activities = data.array;
        randomSuggestion();
        setInterval(randomSuggestion, 3000);
    });

    var fbLoggedIn = false;
    $(".loginbtn").click(function(e) {
        e.preventDefault();
        //Change colour if logged in
        checkLoginState(function() {
            console.log("Logged in");
            fbLoggedIn = true;
            getFBInfo(function() {
                $(".loginbtn").css("background", '#3b5998 url("//graph.facebook.com/' + user.serviceID + '/picture?width=30") 13px 10px no-repeat');
                $(".loginbtn").html(user.firstName + ' ' +  user.lastName);
                checkValidation();
            });
        }); //initiate check for FB login status
    });

    $(".loginbtn").css({
        "border-radius": "6px",
        "-webkit-animation-name": "changeBorderRadius",
        "-webkit-animation-duration": "1s",
        "animation-name": "changeBorderRadius",
        "animation-duration": "1s"
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

    function randomSuggestion() {
        var random = Math.floor((Math.random() * activities.length));
        var activity = activities[random];
        $("#search").attr("placeholder", activity);
    }

    // Animate column change to show Map!!
    $('#locationbtn').click(function(e) {
        e.preventDefault();
        toggleMap();
    });
    $('#closeMap').click(function() {
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
            google.maps.event.trigger(map, 'resize');
        }
        else {
            // Bigger devices
            if (isMapOpen == true) {
                isMapOpen = false;
                $('#mapCol').toggleClass('mapColNone');
                $('#mapCol').toggleClass('mapColHalf');
                setTimeout(function() {
                    $('#formCol').toggleClass('formColFull');
                    $('#formCol').toggleClass('formColHalf');
                    google.maps.event.trigger(map, 'resize');
                }, 50);
            }
            else {
                isMapOpen = true;
                $('#formCol').toggleClass('formColFull');
                $('#formCol').toggleClass('formColHalf');
                setTimeout(function() {
                    $('#mapCol').toggleClass('mapColNone');
                    $('#mapCol').toggleClass('mapColHalf');
                    google.maps.event.trigger(map, 'resize');
                }, 300);
            }
        }

    }

    // get envolved button
    $("#getEnvolvedBtn").click(function(e) {
        e.preventDefault();
        user["number"] = $("#phonenumber").val();
        $.ajax({
            url: 'http://foc-2015-harjot1singh.c9.io/api/user',
            type: 'POST',
            data: JSON.stringify(user),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log(data);
                console.log("userid", data);
                userid = data.userID;
                sendRequest();
                $("html").fadeOut(500, function() {
                    location.hash = "dashboard";
                    $.ajax({
                        url: 'http://foc-2015-harjot1singh.c9.io/viewmatches.html',
                        type: 'GET',
                        success: function(data) {
                            $("html").html(data);
                        },
                        failure: function(data) {
                            console.error("Error:", data);
                        }
                    });
                });
            },
            failure: function(data) {
                console.error("Error:", data);
            }
        });

        //assumes validation has passed as button is now visible

        //   if ($("#search").val().length > 0 && $("#phonenumber").val().length > 0) {
        //       //validation surpassed

        //   } else alert("Please fill in all details");
        //   //Send user details and request details here
    });
    //when phone number looses focus
    var btnState = false;

    function checkValidation() {
        if ($("#search").val().length > 0 && $("#phonenumber").val().length > 0 && fbLoggedIn) {
            if (btnState == false) showGetEnvolvedBtn();
        }
        else if (btnState == true) hideGetEnvolvedBtn();
    }

    $("#phonenumber").keyup(checkValidation);
    $("#search").keyup(checkValidation);

    //Show and hide button depending on satisfied conditions
    function showGetEnvolvedBtn() {
        btnState = true;
        console.log("showing button");
        toggleEnvolvedBtn();
    }

    function hideGetEnvolvedBtn() {
        console.log("hiding button");
        btnState = false;
        toggleEnvolvedBtn();
    }

});

function toggleEnvolvedBtn() {
    $("#getEnvolvedBtn").toggleClass('getEnvolvedShown getEnvolvedHidden');
    $("#envolveLabel").toggleClass('getEnvolvedCompShown getEnvolvedCompHidden');
    $("#goIcon").toggleClass('getEnvolvedCompShown getEnvolvedCompHidden');
    $(".orsee").toggleClass('orseeHidden');
}


function sendRequest() {
    var pos = distanceWidget.get('position');
    var distance = String(parseFloat(distanceWidget.get('distance')) * 0.621371192);
    console.log(distance);
    console.log(pos);
    var publicAddress = "No address available";
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': pos
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                publicAddress = results[1].formatted_address;
                console.log(publicAddress);
                console.log("userid", userid);
                var requestdata = {
                    "activityName": $('#search').val(),
                    "number": $('.phonenofield').val(),
                    "endDate": selectedDate,
                    "userID": userid,
                    "publicRadius": distance,
                    "publicLatitude": pos.G,
                    "publicLongitude": pos.K,
                    "publicName": publicAddress,
                };

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
        }
    });

}

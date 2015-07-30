$(document).ready(function() {
    // Attach all event handlers here
    $(".locationbtn").click(function(e){
       e.preventDefault();
    });
    
    $(".loginbtn").click(function(e) {
        e.preventDefault();
        checkLoginState(); //initiate check for FB login status
        SendToDB(function(data){ //this will send the FB data package to the user database
            var userid = data.userID;
        });
        console.log(selectedDate);
        var requestdata = {
            "activityName": $('.typeahead').val(),
            "number": $('.phonenofield').val(),
            "endDate": selectedDate,
            "userID": $.userID
        }
//         $.ajax({
// 			url: 'http://foc-2015-harjot1singh.c9.io/api/request',
// 			type: 'POST',
//             data: JSON.stringify(requestdata),
//             contentType: "application/json; charset=utf-8",
// 			dataType: "json",
// 			success: function(data) {
// 				console.log(data);
// 				console.log("DONE!");
// 			},
// 			failure: function(data) {
// 				console.error("Error:", data);
// 				console.log("Something went wrong");
// 			}
// 		});
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
    var selectedDate;
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
    
    
    // Animate column change
    var isMapOpen = false;
    
    $('#locationbtn').on('click', function () {
        if (isMapOpen == true) {
            $('#formCol').toggleClass('formColHalf');
        $('#mapCol').toggleClass('mapColHalf');
        } else {
            $('#formCol').toggleClass('formColHalf');
            $('#mapCol').toggleClass('mapColHalf');
        }
    });
});


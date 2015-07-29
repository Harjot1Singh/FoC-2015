$(document).ready(function() {
    // Attach all event handlers here
    $(".loginbtn").click(function(e) {
        e.preventDefault();
        checkLoginState(); //initiate check for FB login status
        SendToDB(); //this will send the data package to the database
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
        var selectedDate = $(".datepicker").datepicker("getDate");
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

});

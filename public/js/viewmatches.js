$(document).ready(function() {

    // init
    // var leftPanel = $("#left_slide_panel");
    var resize = $("#left");
    var containerWidth = $("#columnContainer").width();

    $(resize).resizable({
        handles: 'e',
        maxWidth: 450,
        minWidth: 120,
        resize: function(event, ui) {
            var currentWidth = ui.size.width;

            // this accounts for padding in the panels + 
            // borders, you could calculate this using jQuery
            var padding = 12;

            // this accounts for some lag in the ui.size value, if you take this away 
            // you'll get some instable behaviour
            $(this).width(currentWidth);

            // set the content panel width
            $("#content").width(containerWidth - currentWidth - padding);
        }
    });


});
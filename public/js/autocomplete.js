//Autocomplete and inline complete code
var haystack = ["ActionScript", "AppleScript", "Asp", "BASIC"];

$(function() {
  $('#container').suggest(haystack, {
    suggestionColor: '#cccccc',
    moreIndicatorClass: 'suggest-more',
    moreIndicatorText: '&hellip;'
  });
});

$.getJSON("http://foc-2015-harjot1singh.c9.io/activity.json", function(data) {
  console.log("Downloaded activity list");
  $(function() {
    $('#search').suggest(data.array);
  });
});
var haystack = ["ActionScript", "AppleScript", "Asp", "BASIC"];

$(function(){
  $('#container').suggest(haystack, {
    suggestionColor   : '#cccccc',
    moreIndicatorClass: 'suggest-more',
    moreIndicatorText : '&hellip;'
  });
});
$("#the_basics .typeahead").blur(function (e) {
  alert("lost focus");
});
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var states = [
"meet friends",
"watch a movie",
"hang out",
"fishing",
"camping",
"sightseeing",
"produce something",
"volunteer work",
"eat dinner",
"have a snack",
"have a drink",
"go to a cafe",
"play Risk",
"play Chess",
"play Dungeons and Dragons",
"play soccer",
"play american football",
"play rugby",
"play tennis",
"play cricket",
"swim",
"bike",
"do web design",
"create databases",
"develop native apps",
"develop games"
];

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 0
},
{
  name: 'states',
  source: substringMatcher(states)

});
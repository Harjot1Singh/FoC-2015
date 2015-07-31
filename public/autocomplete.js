

    $.getJSON("http://foc-2015-harjot1singh.c9.io/activity.json", function( data ) {
     console.log(data.array);
     $(function(){
      $('#search').suggest(data.array);
    });
    });
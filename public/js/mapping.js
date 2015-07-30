$(document).ready(function() {
    var map;
    function initialize() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 8,
            center: {lat: -34.397, lng: 150.644}
        });
    }
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(53, -2.5),
      title: 'Some location'
    });
    
    var circle = new google.maps.Circle({
      map: map,
      radius: 16093,    // 10 miles in metres
      fillColor: '#AA0000'
    });
    circle.bindTo('center', marker, 'position');
    
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    console.log(lat, lng)
});

google.maps.event.addDomListener(window, 'load', initialize);
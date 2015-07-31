/**
 * A distance widget that will display a circle that can be resized and will
 * provide the radius in km.
 *
 * @param {Object} opt_options Options such as map, position etc.
 *
 * @constructor
 */

function DistanceWidget(opt_options) {
  var options = opt_options || {};

  this.setValues(options);

  if (!this.get('position')) {
    this.set('position', map.getCenter());
  }

  // Add a marker to the page at the map center or specified position
  var marker = new google.maps.Marker({
    draggable: true,
    title: 'Move me!'
  });

  marker.bindTo('map', this);
  marker.bindTo('zIndex', this);
  marker.bindTo('position', this);
  marker.bindTo('icon', this);

  // Create a new radius widget
  var radiusWidget = new RadiusWidget(options['distance'] || 50);

  // Bind the radius widget properties.
  radiusWidget.bindTo('center', this, 'position');
  radiusWidget.bindTo('map', this);
  radiusWidget.bindTo('zIndex', marker);
  radiusWidget.bindTo('maxDistance', this);
  radiusWidget.bindTo('minDistance', this);
  radiusWidget.bindTo('color', this);
  radiusWidget.bindTo('activeColor', this);
  radiusWidget.bindTo('sizerIcon', this);
  radiusWidget.bindTo('activeSizerIcon', this);

  // Bind to the radius widget distance property
  this.bindTo('distance', radiusWidget);
  // Bind to the radius widget bounds property
  this.bindTo('bounds', radiusWidget);

  var me = this;
  google.maps.event.addListener(marker, 'dblclick', function() {
    // When a user double clicks on the icon fit to the map to the bounds
    map.fitBounds(me.get('bounds'));
  });
}
DistanceWidget.prototype = new google.maps.MVCObject();


/**
 * A radius widget that add a circle to a map and centers on a marker.
 *
 * @param {number} opt_distance Optional starting distance.
 * @constructor
 */
function RadiusWidget(opt_distance) {
  var circle = new google.maps.Circle({
    strokeWeight: 2
  });

  this.set('distance', opt_distance);
  this.set('active', false);
  this.bindTo('bounds', circle);

  circle.bindTo('center', this);
  circle.bindTo('zIndex', this);
  circle.bindTo('map', this);
  circle.bindTo('strokeColor', this);
  circle.bindTo('radius', this);

  this.addSizer_();
}
RadiusWidget.prototype = new google.maps.MVCObject();


/**
 * Add the sizer marker to the map.
 *
 * @private
 */
RadiusWidget.prototype.addSizer_ = function() {
  var sizer = new google.maps.Marker({
    draggable: true,
    title: 'Drag me!',
    raiseOnDrag: false
  });

  sizer.bindTo('zIndex', this);
  sizer.bindTo('map', this);
  sizer.bindTo('icon', this);
  sizer.bindTo('position', this, 'sizer_position');

  var me = this;
  google.maps.event.addListener(sizer, 'dragstart', function() {
    me.set('active', true);
  });

  google.maps.event.addListener(sizer, 'drag', function() {
    // Set the circle distance (radius)
    me.setDistance_();
  });

  google.maps.event.addListener(sizer, 'dragend', function() {
    me.set('active', false);
  });
};


/**
 * Update the radius when the distance has changed.
 */
RadiusWidget.prototype.distance_changed = function() {
  this.set('radius', this.get('distance') * 1000);
};

/**
 * Update the radius when the min distance has changed.
 */
RadiusWidget.prototype.minDistance_changed = function() {
  if (this.get('minDistance') &&
      this.get('distance') < this.get('minDistance')) {
    this.setDistance_();
  }
};


/**
 * Update the radius when the max distance has changed.
 */
RadiusWidget.prototype.maxDistance_changed = function() {
  if (this.get('maxDistance') &&
      this.get('distance') > this.get('maxDistance')) {
    this.setDistance_();
  }
};


/**
 * Update the stroke color when the color is changed.
 */
RadiusWidget.prototype.color_changed = function() {
  this.active_changed();
};


/**
 * Update the active stroke color when the color is changed.
 */
RadiusWidget.prototype.activeColor_changed = function() {
  this.active_changed();
};


/**
 * Update the active stroke color when the color is changed.
 */
RadiusWidget.prototype.sizerIcon_changed = function() {
  this.active_changed();
};


/**
 * Update the active stroke color when the color is changed.
 */
RadiusWidget.prototype.activeSizerIcon_changed = function() {
  this.active_changed();
};


/**
 * Update the center of the circle and position the sizer back on the line.
 *
 * Position is bound to the DistanceWidget so this is expected to change when
 * the position of the distance widget is changed.
 */
RadiusWidget.prototype.center_changed = function() {
  var sizerPos = this.get('sizer_position');
  var position;
  if (sizerPos) {
    position = this.getSnappedPosition_(sizerPos);
  } else {
    var bounds = this.get('bounds');
    if (bounds) {
      var lng = bounds.getNorthEast().lng();
      position = new google.maps.LatLng(this.get('center').lat(), lng);
    }
  }

  if (position) {
    this.set('sizer_position', position);
  }
};

/**
 * Update the center of the circle and position the sizer back on the line.
 */
RadiusWidget.prototype.active_changed = function() {
  var strokeColor;
  var icon;

  if (this.get('active')) {
    if (this.get('activeColor')) {
      strokeColor = this.get('activeColor');
    }

    if (this.get('activeSizerIcon')) {
      icon = this.get('activeSizerIcon');
    }
  } else {
    strokeColor = this.get('color');

    icon = this.get('sizerIcon');
  }

  if (strokeColor) {
    this.set('strokeColor', strokeColor);
  }

  if (icon) {
    this.set('icon', icon);
  }
};


/**
 * Set the distance of the circle based on the position of the sizer.
 * @private
 */
RadiusWidget.prototype.setDistance_ = function() {
  // As the sizer is being dragged, its position changes.  Because the
  // RadiusWidget's sizer_position is bound to the sizer's position, it will
  // change as well.
  var pos = this.get('sizer_position');
  var center = this.get('center');
  var distance = this.distanceBetweenPoints_(center, pos);

  if (this.get('maxDistance') && distance > this.get('maxDistance')) {
    distance = this.get('maxDistance');
  }

  if (this.get('minDistance') && distance < this.get('minDistance')) {
    distance = this.get('minDistance');
  }

  // Set the distance property for any objects that are bound to it
  this.set('distance', distance);

  var newPos = this.getSnappedPosition_(pos);
  this.set('sizer_position', newPos);
};


/**
 * Finds the closest left or right of the circle to the position.
 *
 * @param {google.maps.LatLng} pos The position to check against.
 * @return {google.maps.LatLng} The closest point to the circle.
 * @private.
 */
RadiusWidget.prototype.getSnappedPosition_ = function(pos) {
  var bounds = this.get('bounds');
  var center = this.get('center');
  var left = new google.maps.LatLng(center.lat(),
      bounds.getSouthWest().lng());
  var right = new google.maps.LatLng(center.lat(),
      bounds.getNorthEast().lng());

  var leftDist = this.distanceBetweenPoints_(pos, left);
  var rightDist = this.distanceBetweenPoints_(pos, right);

  if (leftDist < rightDist) {
    return left;
  } else {
    return right;
  }
};


/**
 * Calculates the distance between two latlng points in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};
var distanceWidget;
var map;
var geocodeTimer;
var profileMarkers = [];

function GetLocation(location) {
    if (location) {
    userlat = location.coords.latitude;
    userlong = location.coords.longitude;
    };
    map.setCenter(new google.maps.LatLng(userlat, userlong));
    distanceWidget = new DistanceWidget({
    map: map,
    distance: 7, // Starting distance in km.
    maxDistance: 2500, // Twitter has a max distance of 2500km.
    color: '#000000',
    activeColor: '#5599bb',
    sizerIcon: 'resize-off.png',
    activeSizerIcon: 'resize.png'
  });
  
  
  google.maps.event.addListener(distanceWidget, 'distance_changed',
      updateDistance);

  google.maps.event.addListener(distanceWidget, 'position_changed',
      updatePosition);

  map.fitBounds(distanceWidget.get('bounds'));

  updateDistance();
  updatePosition();
  addActions();
}

function init() {
  var mapDiv = document.getElementById('map');
  navigator.geolocation.getCurrentPosition(GetLocation);
  map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(userlat, userlong),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  

}

function updatePosition() {
  if (geocodeTimer) {
    window.clearTimeout(geocodeTimer);
  }

  // Throttle the geo query so we don't hit the limit
  geocodeTimer = window.setTimeout(function() {
    reverseGeocodePosition();
  }, 200);
}

function reverseGeocodePosition() {
  var pos = distanceWidget.get('position');
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': pos}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $('#of').html('of ' + results[1].formatted_address);
        return;
      }
    }

    $('#of').html('of *no location set*');
  });
}

function updateDistance() {
  var distance = parseFloat(distanceWidget.get('distance'))*0.621371192;
  $('#dist').html(distance.toFixed(2));
}

function addActions() {
  var s = $('#s').submit(search);

  $('#close').click(function() {
    $('#cols').removeClass('has-cols');
    google.maps.event.trigger(map, 'resize');
    map.fitBounds(distanceWidget.get('bounds'));
    $('#results-wrapper').hide();

    return false;
  });
}

function search(e) {
  e.preventDefault();
  var q = $('#q').val();
  if (q == '') {
    return false;
  }

  var d = distanceWidget.get('distance')*0.621371192;
  var p = distanceWidget.get('position');

  var url = 'http://search.twitter.com/search.json?callback=addResults' +
    '&rrp=100&q=' + escape(q) + '&geocode=' + escape(p.lat() + ',' + p.lng() +
    ',' + d + 'mile');

  clearMarkers();

  $.getScript(url);

  $('#results').html('Searching...');
  var cols = $('#cols');
  if (!cols.hasClass('has-cols')) {
    $('#cols').addClass('has-cols');
    google.maps.event.trigger(map, 'resize');
    map.fitBounds(distanceWidget.get('bounds'));
  }
}

function clearMarkers() {
  for (var i = 0, marker; marker = profileMarkers[i]; i++) {
    marker.setMap(null);
  }
}

$(document).ready(function() {
    $("#logButton").click(function(e) {
        e.preventDefault();
        var pos = distanceWidget.get('position');
        var distance = String(parseFloat(distanceWidget.get('distance'))*0.621371192 );
        console.log(distance);
        console.log(pos);
    });
});

var x = document.getElementById("demo");

google.maps.event.addDomListener(window, 'load', init);
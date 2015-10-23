function getCity(geocoder, map, infoWindow, latlng) {
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results) {
        // console.log(results);
        var cityName = results[0].address_components[2].long_name;
        // console.log(cityName);
        infoWindow.setContent('you are in '+cityName);
        $('#earth-icon').attr('value', cityName);
        setTimeout(function(){
          infoWindow.close();
          // console.log(infoWindow);
        }, 2000);
      } else {
        window.alert('No results found');
        $('#earth-icon').attr('value', 'Nashville');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
      $('#earth-icon').attr('value', 'Nashville');
    }
  });
}

// function initMap(){
//   setTimeout(function(){
//     initMapAfter
//   },1000);
// }

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 10,
    disableDefaultUI: true,
    scrollwheel: false,
    panControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    draggable: false
  });

  var geocoder = new google.maps.Geocoder;
  var infoWindow = new google.maps.InfoWindow({map: map, content: '<div class="mylabel">The label</div>'});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var latlng = {lat: pos.lat, lng: pos.lng}
      getCity(geocoder, map, infoWindow, latlng);

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  // var input = document.getElementById('latlng').value;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

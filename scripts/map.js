var map;
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.250756, lng: -123.0007691 },
    zoom: 14,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });


  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    // markers.forEach((marker) => {
    //   marker.setMap(null);
    // });
    // markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      

      // Create a marker for each place.
      // markers.push(
      //   new google.maps.Marker({
      //     map,
      //     icon,
      //     title: place.name,
      //     position: place.geometry.location,
      //   })
      // );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.getElementById("current-location");

  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);

}
var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
function displayPostMarkers() {
  db.collection('posts')
  .get()
  .then(snap => {
    snap.forEach(doc =>{
      severity = doc.data().severity;
      docId = doc.id;
      lat = doc.data().lat;
      lng = doc.data().lng;
      console.log(docId)
      if(severity == "severe") {
        new google.maps.Marker({
          docid: docId,
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: iconBase + 'red-blank.png'

        });
      }
      else if(severity == "moderate") {
        new google.maps.Marker({
          docid: docId,
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: iconBase + 'orange-blank.png'
        });
      }
      else {
        new google.maps.Marker({
          docid: docId,
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: iconBase + 'ylw-blank.png'
        });
      }      
     
      
    });
  });
}

displayPostMarkers();
window.initAutocomplete = initAutocomplete;

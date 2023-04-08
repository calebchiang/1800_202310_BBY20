var map;
var url;
var lat;
var lng;
//Sets lat and lng if user is directed from button 'see on map' from 'posts' page and centers the map on the selected post. If not, centered on BCIT. 
function setLocation() {
  var params = new URLSearchParams(window.location.search)
    lat = params.get("lat");
    lng = params.get('lng');
    if (lat === null || lng === null){
      lat = 49.24846075017561;
      lng = -123.00176401880974; 
    }
    
  }
setLocation();


//initializes the google maps api map for our interactive map page.
function initAutocomplete() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
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

  let markers = [];
  
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    //Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

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
      

      //Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
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

/*Creating markers for each post uploaded to firebase. Checking the value of the severity determines the color of the marker
 *The marker also contains a click listener that displays a modal window of the post details. This code seems redundant and clunky,
 * but it doesn't seem to like it when you try to put any other code than what google expects in the definition variables
 * for the marker. There is possibly a way to make this more efficient but we could not find it.
*/
var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
var postModal = document.querySelector("#postModal");
var postModalContent = document.querySelector("#postModalContent");
function displayPostMarkers() {
  db.collection('posts')
  .get()
  .then(snap => {
    snap.forEach(doc =>{
      severity = doc.data().severity;
      docId = doc.id;
      lat = doc.data().lat;
      lng = doc.data().lng;
      if(severity == "severe") {
        new google.maps.Marker({
          url: 'postdetails.html?docId=' + docId,
          position: new google.maps.LatLng(lat, lng),
          animation: google.maps.Animation.DROP,
          map:map,
          icon: iconBase + 'red-circle.png'

        }).addListener('click',function(){
          postModal.style.display = "block";
          postModalContent.innerHTML = `
          <div class="post-modal-content">
            <div class="post-modal-header">
              <span class="close" id="postModalClose">&times;</span>
              <h2>${doc.data().title}</h2>
              <img class="post-modal-image" src="${doc.data().image}" alt="post image">
            </div>
            <div class="post-modal-body">
              <p><b>Description:</b> ${doc.data().description}</p>
              <p><b>Severity:</b> ${doc.data().severity}</p>
              <p><b>Uploaded:</b> ${moment.unix(doc.data().last_updated.seconds).format("MMM DD, YYYY [at] hh:mm A")} by ${doc.data().user ? doc.data().user : "anonymous"}
              </p>
            </div>
          </div>
          `;
          var postModalClose = document.querySelector("#postModalClose");
          postModalClose.addEventListener('click', function() {
            postModal.style.display = "none";
          });
        });
      }
      else if(severity == "moderate") {
        new google.maps.Marker({
          url: 'postdetails.html?docId=' + docId,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(lat, lng),
          map:map,
          icon: iconBase + 'orange-circle.png'
        }).addListener('click',function(){
          postModal.style.display = "block";
          postModalContent.innerHTML = `
          <div class="post-modal-content">
            <div class="post-modal-header">
              <span class="close" id="postModalClose">&times;</span>
              <h2>${doc.data().title}</h2>
              <img class="post-modal-image" src="${doc.data().image}" alt="post image">
            </div>
            <div class="post-modal-body">
              <p><b>Description:</b> ${doc.data().description}</p>
              <p><b>Severity:</b> ${doc.data().severity}</p>
              <p><b>Uploaded:</b> ${moment.unix(doc.data().last_updated.seconds).format("MMM DD, YYYY [at] hh:mm A")} by ${doc.data().user ? doc.data().user : "anonymous"}
              </p>
            </div>
          </div>
          `;
          var postModalClose = document.querySelector("#postModalClose");
          postModalClose.addEventListener('click', function() {
            postModal.style.display = "none";
          });
        });
      }
      else {
        new google.maps.Marker({
          url: 'postdetails.html?docId=' + docId,
          position: new google.maps.LatLng(lat, lng),
          animation: google.maps.Animation.DROP,
          map:map,
          icon: iconBase + 'ylw-circle.png'
        }).addListener('click',function(){
          // window.location.href = this.url;
          postModal.style.display = "block";
          postModalContent.innerHTML = `
          <div class="post-modal-content">
            <div class="post-modal-header">
              <span class="close" id="postModalClose">&times;</span>
              <h2>${doc.data().title}</h2>
              <img class="post-modal-image" src="${doc.data().image}" alt="post image">
            </div>
            <div class="post-modal-body">
              <p><b>Description:</b> ${doc.data().description}</p>
              <p><b>Severity:</b> ${doc.data().severity}</p>
              <p><b>Uploaded:</b> ${moment.unix(doc.data().last_updated.seconds).format("MMM DD, YYYY [at] hh:mm A")} by ${doc.data().user ? doc.data().user : "anonymous"}
              </p>
            </div>
          </div>
          `;
          var postModalClose = document.querySelector("#postModalClose");
          postModalClose.addEventListener('click', function() {
            postModal.style.display = "none";
          });
        });
      } 
    });
  });
}

if(localStorage.getItem("firstTime")==null){
  alert("Click on any marker to see post details");
  localStorage.setItem("firstTime","done");
}

displayPostMarkers();
window.initAutocomplete = initAutocomplete;
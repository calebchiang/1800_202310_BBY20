// global variables for lat and lng so they can be accessed by all functions.
var lat;
var lng;

function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
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

  // grabs the lat and lng from the dropped marker on the map.
  google.maps.event.addListener(map, "click", function (e) {
    console.log(e.latLng.lat(), e.latLng.lng());
    lat = e.latLng.lat();
    lng = e.latLng.lng();
    placeMarker(e.latLng);
  });

  function placeMarker(location) {
    
      var marker = new google.maps.Marker({
        position:location,
        map:map,
      });
    
      marker.setPosition(location);
    
  }
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

window.initAutocomplete = initAutocomplete;

var ImageFile;
function listenFileSelect() {
  var fileInput = document.getElementById("photo");
  const image = document.getElementById("image");

  fileInput.addEventListener("change", function (e) {
    ImageFile = e.target.files[0];
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob;
  });
}
listenFileSelect();

// document.addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     document.getElementById("submit-button").click();
//   }
// });

function submit() {
  document.form.reset();
  uploadPost();
}

// Uploads all fields from the form including the lat lng from the dropped pin on the map.
function uploadPost() {
  alert("Your Post has been uploaded. You may now view it under your user profile.");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var desc = document.getElementById("hazard-description").value;
      var severity = document.getElementById("severity-select").value;
      db.collection("posts")
        .add({
          owner: user.uid,
          image: "",
          lat: lat,
          lng: lng,
          description: desc,
          severity: severity,
          last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
        })
        .then((doc) => {
          console.log(title);
          uploadPic(doc.id);
        });
    } else {
      // No user is signed in.
      console.log("Error, no user signed in");
    }
  });
}
//uploads attached photo to firebase storage and links it with the post doc id.
function uploadPic(postDocID) {
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(ImageFile)
    .then(function () {
      console.log("Uploaded to Cloud Storage.");
      storageRef.getDownloadURL().then(function (url) {
        console.log("Got the download URL.");
        db.collection("posts")
          .doc(postDocID)
          .update({
            image: url,
          })
          .then(function () {
            console.log("Added pic URL to Firestore.");
          });
      });
    })
    .catch((error) => {
      console.log("error uploading to cloud storage");
    });
}

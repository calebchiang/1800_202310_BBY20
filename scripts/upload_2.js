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

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    // event.preventDefault();
    document.getElementById("submit-button").click();
  }
});
function uploadPost() {
  alert("Post is being uploaded");
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var desc = document.getElementById("hazard-description").value;
      var severity = document.getElementById("severity-select").value;
      db.collection("posts")
        .add({
          owner: user.uid,
          image: "",
          description: desc,
          severity: severity,
          last_updated: firebase.firestore.FieldValue.serverTimestamp(), //current system time
        })
        .then((doc) => {
          console.log("Post document added!");
          console.log(doc.id);
          uploadPic(doc.id);
        });
    } else {
      // No user is signed in.
      console.log("Error, no user signed in");
    }
  });
}

function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
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

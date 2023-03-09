var ImageFile;
function listenFileSelect() {
      // listen for file selection
      var fileInput = document.getElementById("photo"); // pointer #1
      const image = document.getElementById("image"); // pointer #2

			// When a change happens to the File Chooser Input
      fileInput.addEventListener('change', function (e) {
          ImageFile = e.target.files[0];   //Global variable
          var blob = URL.createObjectURL(ImageFile);
          image.src = blob; // Display this image
      })
}
listenFileSelect();

        function uploadPost() {
       alert ("SAVE POST is triggered");
       firebase.auth().onAuthStateChanged(function (user) {
           if (user) {
               // User is signed in.
               // Do something for the user here. 
               var desc = document.getElementById("hazard-description").value;
               var severity = document.getElementById("severity-select").value;
               db.collection("posts").add({
                   owner: user.uid,
                   image: "",
                   description: desc,
                   severity: severity,
                   last_updated: firebase.firestore.FieldValue
                       .serverTimestamp() //current system time
               }).then(doc => {
                   console.log("Post document added!");
                   console.log(doc.id);
                   uploadPic(doc.id);
               })
           } else {
               // No user is signed in.
							 console.log("Error, no user signed in");
           }
       });
}


function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile
        .then(function () {
            console.log('Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()
                .then(function (url) { // Get URL of the uploaded file
                    console.log("Got the download URL.");
                    db.collection("posts").doc(postDocID).update({
                            "image": url // Save the URL into users collection
                        })
                        .then(function () {
                            console.log('Added pic URL to Firestore.');
                        })
                })
        })
        .catch((error) => {
             console.log("error uploading to cloud storage");
        })
}

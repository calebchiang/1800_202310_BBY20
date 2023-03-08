function uploadPost() {
    const ref = firebase.storage().ref()
    const file = document.querySelector("#photo").files[0]
    const name = new Date() + '-' + file.name
    const metadata = {
        contentType:file.type
    }
    const task = ref.child(name).put(file,metadata)
   
let severity = document.getElementById("severity-select").value;
// let image = document.getElementById("myfile").value;
let description = document.getElementById("hazard-description").value;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var currentUser = db.collection("users").doc(user.uid)
        var userID = user.uid;
        //get the document for current user.
        currentUser.get()
            .then(userDoc => {
                var userEmail = userDoc.data().email;
                db.collection("posts").add({
                    userID: userID,
                    // image: image,
                    severity: severity,
                    description: description,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    window.location.href = "map.html"; //new line added
                })

                task
.then(snapshot => snapshot.ref.getDownloadURL())
.then(url => {
   console.log(url)
   alert("Image upload successful")
   const image = document.querySelector('#image')
   image.src = url
});
            })
    } else {
        console.log("No user is signed in");
        alert("Please sign in to upload!")
        window.location.href = 'upload.html';
    }
});

}

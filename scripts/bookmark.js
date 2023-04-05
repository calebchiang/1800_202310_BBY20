//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// Function inserts user's name from firestore
//----------------------------------------------------------//----------------------------------------------------------
function insertNameFromFirestore(user) {
            db.collection("users").doc(user.uid).get().then(userDoc => {
                console.log(userDoc.data().name)
                userName = userDoc.data().name;
                console.log(userName)
                document.getElementById("name-goes-here").innerHTML = userName;
            })

}

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(user) {
  db.collection("users").doc(user.uid).get()
      .then(userDoc => {

          // Get the Array of bookmarks
          var bookmarks = userDoc.data().bookmarks;
          console.log(bookmarks);
          
          // Get pointer the new card template
          let newcardTemplate = document.getElementById("savedCardTemplate");

          // Iterate through the ARRAY of bookmarked hikes (document ID's)
          bookmarks.forEach(thisPostID => {
              console.log(thisPostID);
              db.collection("posts").doc(thisPostID).get().then(doc => {
                  var title = doc.data().title; // get title value
                  var description = doc.data().description; // get value of the description
                  var severity = doc.data().severity; //gets the severity
                  var image = doc.data().image;
        
                   //clone the new card
                  let newcard = newcardTemplate.content.cloneNode(true);

                  //update description, severity, and image

                  newcard.querySelector('.card-title').innerHTML = title;
                  newcard.querySelector('.card-text').innerHTML = description;
                  newcard.querySelector('.severity').innerHTML = severity;
                  newcard.querySelector('.card-img-top').src = image; // set the src attribute of the img element to the URL
                  
           
                  savedCardGroup.appendChild(newcard);
              })
          });
      })
}
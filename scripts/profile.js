var currentUser; //put this right after you start script tag before writing any functions.

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        var userName = userDoc.data().name;
        var userEmail = userDoc.data().email;
        var userCity = userDoc.data().city;

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("nameInput").value = userName;
        }
        if (userEmail != null) {
          document.getElementById("emailInput").value = userEmail;
        }
        if (userCity != null) {
          document.getElementById("cityInput").value = userCity;
        }
      });

      const cardTemplate = document.getElementById("postCardTemplate");
      db.collection("posts")
        .where("owner", "==", user.uid)
        .get()
        .then((allPosts) => {
          allPosts.forEach((post) => {
            const { last_updated, description, owner, severity, image } =
              post.data();
            // make card a clone of cardTemplate
            let card = $("<div>");
            $(card).html(cardTemplate.innerHTML);

            $(card)
              .find("img")
              .attr(
                "src",
                image ||
                  "https://www.keflatwork.com/wp-content/uploads/2019/08/Empty-sidewalk.jpg"
              );
            $(card).find(".card-text").text(description);
            $(card).find(".severity").text(severity);
            if (last_updated)
              $(card)
                .find(".last_updated")
                .text(
                  moment
                    .unix(last_updated.seconds)
                    .format("MMM DD, YYYY [at] hh:mm A")
                );

            db.collection("users")
              .doc(owner)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  $(card).find(".owner").text(doc.data().name);
                } else {
                  $(card).find(".owner").text("Anonymous");
                }
              })
              .catch((error) => {
                console.log("Error getting user's name:", error);
              });

            $(".card-container").append(card);

            let deleteButton = $(card).find(".delete-button");
            $(deleteButton).click(() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                post.ref.delete();
                $(card).remove();
              }
            });
          });
        });
        
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
  userName = document.getElementById("nameInput").value; //get the value of the field with id="nameInput"
  userEmail = document.getElementById("emailInput").value; //get the value of the field with id="schoolInput"
  userCity = document.getElementById("cityInput").value; //get the value of the field with id="cityInput"

  currentUser
    .update({
      name: userName,
      email: userEmail,
      city: userCity,
    })
    .then(() => {
      console.log("Document successfully updated!");
    });

  document.getElementById("personalInfoFields").disabled = true;
}


function insertNameFromFirestore(){
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user =>{
      if (user){
         console.log(user.uid); // let me to know who is the user that logged in to get the UID
         currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
         currentUser.get().then(userDoc=>{
             //get the user name
             var userName= userDoc.data().name;
             console.log(userName);
             //$("#name-goes-here").text(userName); //jquery
             document.getElementById("name-goes-here").innerText=userName;
         })    
     }    
  })
}

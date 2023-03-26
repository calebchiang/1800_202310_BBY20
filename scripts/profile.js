function insertNameFromFirestore() {
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // let me to know who is the user that logged in to get the UID
      currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
      currentUser.get().then((userDoc) => {
        //get the user name
        var userName = userDoc.data().name;
        console.log(userName);
        //$("#name-goes-here").text(userName); //jquery
        document.getElementById("name-goes-here").innerText = userName;
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
                console.log("Error getting document:", error);
              });

            $(".card-container").append(card);

            let deleteButton = $(card).find(".delete-button");
            $(deleteButton).click(() => {
              post.ref.delete();
              $(card).remove();
            });
          });
        });
    }
  });
}
insertNameFromFirestore();

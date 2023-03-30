function displayCardsDynamically(collection) {
  const cardTemplate = document.getElementById("postCardTemplate");
  db.collection(collection)
    .orderBy("last_updated", "desc")
    .get()
    .then(allPosts => {
      allPosts.forEach((post) => {
        const postID = post.id;
        const { last_updated, description, owner, severity, image } = post.data();
        // make card a clone of cardTemplate
        let card = $('<div>');
        $(card).html(cardTemplate.innerHTML);

        $(card).find('img').attr('src', image || 'https://www.keflatwork.com/wp-content/uploads/2019/08/Empty-sidewalk.jpg');
        $(card).find('.card-text').text(description);
        $(card).find('.severity').text(severity);
        if (last_updated) $(card).find('.last_updated').text(moment.unix(last_updated.seconds).format("MMM DD, YYYY [at] hh:mm A"));

        db.collection("users").doc(owner)
          .get()
          .then((doc) => {
            if (doc.exists) {
                $(card).find('.owner').text(doc.data().name);
            } else {  
                $(card).find('.owner').text('Anonymous');
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
        });
        $(card).find('i').attr('id', 'save-' + postID).on('click', () => saveBookmark(postID));

        currentUser.get().then(userDoc => {
          //get the user name
          var bookmarks = userDoc.data().bookmarks;
          if (bookmarks.includes(postID)) {
             document.getElementById('save-' + postID).innerText = 'bookmark';
          }
    })
        
        
        
        $('.card-container').append(card);
      });

    });

    

    
}

// displayCardsDynamically("posts");

//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

      

            // the following functions are always called when someone is logged in
            
            displayCardsDynamically("posts");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}

doAll();


//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(postID) {
  currentUser.set({
          bookmarks: firebase.firestore.FieldValue.arrayUnion(postID)
      }, {
          merge: true
      })
      .then(function () {
          console.log("bookmark has been saved for: " + currentUser);
          var iconID = 'save-' + postID;
          //console.log(iconID);
          //this is to change the icon of the hike that was saved to "filled"
          document.getElementById(iconID).innerText = 'bookmark';
      });
}

function openPopup(event) {
  // Get the parent container element of the button
  var parentContainer = event.target.closest('.card');
  
  // Create a new <div> element with the content you want to display
  var popupContent = document.createElement("div");
  popupContent.innerHTML = "<h1>Hello World!</h1>";
  
  // Create a close button and append it to the popup content
  var closeButton = document.createElement("button");
  closeButton.innerHTML = "Close";
  closeButton.style.float = "right";
  closeButton.style.marginTop = "-20px";
  closeButton.addEventListener("click", function() {
    popupContent.parentNode.removeChild(popupContent);
  });
  popupContent.appendChild(closeButton);

  // Style the <div> element to look like a popup window
  popupContent.style.position = "absolute";
  var parentRect = parentContainer.getBoundingClientRect();
  var parentLeft = parentRect.left + window.scrollX;
  var parentTop = parentRect.top + window.scrollY;
  // If u want the window more left
  popupContent.style.left = (parentLeft + parentRect.width/2 - popupContent.offsetWidth/2 + -250) + "px";
  // Adjust the height with this 
  popupContent.style.top = (parentTop + parentRect.height + -500) + "px";
  popupContent.style.width = "600px";
  popupContent.style.height = "400px";
  popupContent.style.padding = "20px";
  popupContent.style.border = "1px solid black";
  popupContent.style.backgroundColor = "white";
  popupContent.style.zIndex = "1000";

  // Append the <div> element to the current page
  document.body.appendChild(popupContent);
}

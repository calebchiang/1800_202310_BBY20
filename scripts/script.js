//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  if (confirm("Are you sure you want to logout?") == true) {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("logging out user");
    }).catch((error) => {
      // An error happened.
    });
  }
}

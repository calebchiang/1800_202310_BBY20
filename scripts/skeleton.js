//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log($('#navbarPlaceholder').load('./text/navbar-after-login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        } else {
            console.log($('#navbarPlaceholder').load('./text/navbar-before-login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        }
    })
    
}
loadSkeleton();

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        firebase.auth().signOut().then(() => {
            console.log("User signed out");
            window.location.href = "index.html";
        }).catch((error) => {
            console.log("Error signing out");
        });
    }
}


  




function displayPostDetails() {
    var params = new URLSearchParams(window.location.search);
    var docId = params.get("docId");

    db.collection("posts")
.doc(docId)
.get()
.then( doc => {
    thisPost = doc.data();
    title = doc.data().title;
    description = doc.data().description;
    severity = doc.data().severity;
    image = doc.data().image;
    time = doc.data().last_updated.toDate();
    
    document.getElementById("title").innerHTML = title;
    document.getElementById("image").src = image;
    document.getElementById("severity").innerHTML = severity;
    document.getElementById("time").innerHTML = time;
    document.getElementById("description").innerHTML = description;

});
}
displayPostDetails();

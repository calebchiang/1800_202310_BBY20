function displayCardsDynamically(collection) {
  const cardTemplate = document.getElementById("postCardTemplate");
  db.collection(collection)
    .orderBy("last_updated", "desc")
    .get()
    .then(allPosts => {
      allPosts.forEach((post) => {
        const postID = post.id;
        const { last_updated, description, owner, severity, image, title, lat, lng } = post.data();
        // make card a clone of cardTemplate
        let card = $('<div>');
        $(card).html(cardTemplate.innerHTML);

        $(card).find('img').attr('src', image || 'https://www.keflatwork.com/wp-content/uploads/2019/08/Empty-sidewalk.jpg');
        $(card).find(".card-title").text(title);
        $(card).find('.card-text').text(description);
        $(card).find('.severity').text(severity);
        if (last_updated) $(card).find('.last_updated').text(moment.unix(last_updated.seconds).format("MMM DD, YYYY [at] hh:mm A"));

        // Redirect to map page centered on the post location
        $(card).find(".see-on-map").on("click", () => {
          window.location.href = `map.html?lat=${lat}&lng=${lng}`;
        });

        db.collection("users").doc(owner)
          .get()
          .then((doc) => {
            if (doc.exists) {
                $(card).find('.owner').text(doc.data().UserName);
            } else {  
                $(card).find('.owner').text('Anonymous');
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
        });
        $(card).find('i').attr('id', 'save-' + postID).on('click', () => saveBookmark(postID));
        $('.card-container').append(card);
      });

    });
}
displayCardsDynamically("posts");

// Listener for form submit
document.getElementById("myForm").addEventListener("submit", saveBookmark);

// add new bookmark
function saveBookmark(e) {
  // Prevent form from submitting
  e.preventDefault();

  // Get form values
  const siteName = document.getElementById("siteName").value;
  const siteUrl = document.getElementById("siteUrl").value;

  // Validate form
  if (!validateForm(siteName, siteUrl)) {
    return false;
  }

  const bookmark = {
    name: siteName,
    url: siteUrl,
  };

  let bookmarks;
  // Check if there is others bookmarks stored in local storage
  if (localStorage.getItem("bookmarks") === null) {
    bookmarks = [];
  } else {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Clear form
  document.getElementById("myForm").reset();

  // add new bookmark to the list
  fetchBookmarks();
}

function validateForm(siteName, siteUrl) {
  // display an alert if the form has empty inputs
  if (!siteName || !siteUrl) {
    alert("Please fill in the form");
    return false;
  }

  // display an alert if the url is invalid
  const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);
  if (!siteUrl.match(regex)) {
    alert("Please use a valid URL");
    return false;
  }

  return true;
}

$(document).ready(() => {
  fetchBookmarks();
});

// show the previous added bookmarks in the page
function fetchBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  let bookmarksResults = document.getElementById("bookmarksResults");

  bookmarksResults.innerHTML = "";
  for (let i = 0; i < bookmarks.length; i++) {
    const name = bookmarks[i].name;
    const url = bookmarks[i].url;

    bookmarksResults.innerHTML += `
            <div class="well">
                <h3>${name} 
                    <a class="btn btn-default" target="_blank" href="${addhttp(
                      url
                    )}">Visit</a>
                    <a class="btn btn-danger" href="#" onclick="deleteBookmark('${url}')">Delete</a>
                </h3>
            </div>
        `;
  }
}

function deleteBookmark(url) {
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  for (let i = 0; i < bookmarks.length; i++) {
    if (url == bookmarks[i].url) {
      bookmarks.splice(i, 1);
    }
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  fetchBookmarks();
}

function addhttp(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

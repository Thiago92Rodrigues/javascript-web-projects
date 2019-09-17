// Listener for form submit
document.getElementById('myForm').addEventListener('submit', saveBookmark);

// add new bookmark
function saveBookmark(e) {
    // Prevent form from submitting
    e.preventDefault();

    // Get form values
    var siteName = document.getElementById('siteName').value;
    var siteUrl = document.getElementById('siteUrl').value;

    // Validate form
    if (!validateForm(siteName, siteUrl)) {
        return false;
    }

    var bookmark = {
        name: siteName,
        url: siteUrl
    }

    // Check if there is others bookmarks stored in local storage
    if (localStorage.getItem('bookmarks') === null) {
        var bookmarks = [];
    } else {
        var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Clear form
    document.getElementById('myForm').reset();

    // add new bookmark to the list
    fetchBookmarks();
}

function validateForm(siteName, siteUrl) {
    // display an alert if the form has empty inputs
    if (!siteName || !siteUrl) {
        alert('Please fill in the form');
        return false;
    }

    // display an alert if the url is invalid
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (!siteUrl.match(regex)) {
        alert('Please use a valid URL');
        return false;
    }

    return true;
}

$(document).ready(() => {
    fetchBookmarks();
});

// show the previous added bookmarks in the page
function fetchBookmarks() {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    var bookmarksResults = document.getElementById('bookmarksResults');

    bookmarksResults.innerHTML = '';
    for (var i = 0; i < bookmarks.length; i++) {
        var name = bookmarks[i].name;
        var url = bookmarks[i].url;

        bookmarksResults.innerHTML += `
            <div class="well">
                <h3>${name} 
                    <a class="btn btn-default" target="_blank" href="${addhttp(url)}">Visit</a>
                    <a class="btn btn-danger" href="#" onclick="deleteBookmark('${url}')">Delete</a>
                </h3>
            </div>
        `;
    }
}

function deleteBookmark(url) {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    for (var i = 0; i < bookmarks.length; i++) {
        if (url == bookmarks[i].url) {
            bookmarks.splice(i, 1);
        }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    fetchBookmarks();
}

function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

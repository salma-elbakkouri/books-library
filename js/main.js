document.addEventListener("DOMContentLoaded", function () {
    loadXML();
    document.getElementById('search-input').addEventListener('input', filterBooks);
});

let xmlDoc; // Store the XML document globally for reuse

function loadXML() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            xmlDoc = this.responseXML; // Store the XML document
            displayBooks(xmlDoc); // Display all books initially
        }
    };
    xhttp.open("GET", "data/books.xml", true);
    xhttp.send();
}

function displayBooks(xml) {
    const booksContainer = document.getElementById("book-list");
    booksContainer.innerHTML = ''; 

    const books = xml.evaluate('//book', xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    let book = books.iterateNext();
    while (book) {
        const title = xml.evaluate('title/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;
        const author = xml.evaluate('author/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;
        const cover = xml.evaluate('cover/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;

        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        const bookImage = document.createElement("img");
        bookImage.src = cover;
        bookImage.alt = title;

        const bookTitle = document.createElement("p");
        bookTitle.className = "book-title";
        bookTitle.textContent = title;

        bookCard.appendChild(bookImage);
        bookCard.appendChild(bookTitle);

        booksContainer.appendChild(bookCard);

        book = books.iterateNext(); // Move to the next book
    }
}

function filterBooks() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const booksContainer = document.getElementById("book-list");
    booksContainer.innerHTML = ''; // Clear current books

    const query = `//book[contains(translate(title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${searchText}') or contains(translate(author, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${searchText}')]`;
    const filteredBooks = xmlDoc.evaluate(query, xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    let book = filteredBooks.iterateNext();
    while (book) {
        const title = xmlDoc.evaluate('title/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;
        const author = xmlDoc.evaluate('author/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;
        const cover = xmlDoc.evaluate('cover/text()', book, null, XPathResult.STRING_TYPE, null).stringValue;

        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        const bookImage = document.createElement("img");
        bookImage.src = cover;
        bookImage.alt = title;

        const bookTitle = document.createElement("p");
        bookTitle.className = "book-title";
        bookTitle.textContent = title;

        bookCard.appendChild(bookImage);
        bookCard.appendChild(bookTitle);

        booksContainer.appendChild(bookCard);

        book = filteredBooks.iterateNext(); // Move to the next book
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadXML();
    document.getElementById('search-input').addEventListener('input', filterBooks);
});

let xmlDoc; 

function loadXML() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            xmlDoc = this.responseXML; 
            displayBooks(xmlDoc); 
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

        book = books.iterateNext();
    }
    initializeCarousel();
}

function initializeCarousel() {
    const books = document.querySelector(".books");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    let index = 0;
    const bookWidth = document.querySelector(".book-card").offsetWidth + 20;
    const visibleBooks = 5; 

    next.addEventListener("click", () => {
        if (index < books.children.length - visibleBooks) {
            index++;
            books.style.transform = `translateX(-${index * bookWidth}px)`;
        }
    });

    prev.addEventListener("click", () => {
        if (index > 0) {
            index--;
            books.style.transform = `translateX(-${index * bookWidth}px)`;
        }
    });
}

function filterBooks() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const booksContainer = document.getElementById("book-list");
    booksContainer.innerHTML = '';

    const query = `//book[contains(translate(title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${searchText}') or contains(translate(author, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${searchText}')]`;
    const filteredBooks = xmlDoc.evaluate(query, xmlDoc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    let book = filteredBooks.iterateNext();
    let found = false;

    while (book) {
        found = true;

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

        book = filteredBooks.iterateNext();
    }

    if (!found) {
        const noResults = document.createElement("p");
        noResults.className = "no-results";
        noResults.textContent = "Not available";
        booksContainer.appendChild(noResults);
    }
}

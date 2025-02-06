document.addEventListener("DOMContentLoaded", function() {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  // Load XML and display the book details for the specified id
  loadXMLAndDisplayBook(bookId);

  // Add event listener for Export Book button
  document.getElementById('export-btn').addEventListener('click', function() {
    // Redirect to the export endpoint so that the server returns the PDF
    window.location.href = `/export-book?id=${bookId}`;
  });
});

function loadXMLAndDisplayBook(bookId) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const xmlDoc = this.responseXML;

      // XPath to find the book with the matching id (searches in both library and books)
      const query = `//book[@id='${bookId}']`;
      const result = xmlDoc.evaluate(
        query,
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (result) {
        // Extract book data
        const title   = result.getElementsByTagName('title')[0].textContent;
        const cover   = result.getElementsByTagName('cover')[0].textContent;
        const summary = result.getElementsByTagName('summary')[0].textContent;
        const year    = result.getElementsByTagName('year')[0].textContent;
        const genre   = result.getElementsByTagName('genre')[0].textContent;
        const price   = result.getElementsByTagName('price')[0].textContent;

        // Extract author details
        const authorNode  = result.getElementsByTagName('author')[0];
        const authorName  = authorNode.getElementsByTagName('name')[0].textContent;
        const authorBio   = authorNode.getElementsByTagName('bio')[0].textContent;
        const authorPhoto = authorNode.getElementsByTagName('photo')[0].textContent;

        // Update DOM elements
        document.getElementById('book-cover').src         = cover;
        document.getElementById('book-title').textContent   = title;
        document.getElementById('book-author').textContent  = authorName;
     //   document.getElementById('author-bio').textContent   = authorBio;
        document.getElementById('book-summary').textContent = summary;

        // Update author section in the summary
        document.getElementById('author-name2').textContent = authorName;
        document.getElementById('author-bio2').textContent  = authorBio;
        document.getElementById('author-photo').src         = authorPhoto;

        // Update book details
        document.getElementById('book-year').textContent  = year;
        document.getElementById('book-genre').textContent = genre;
        document.getElementById('book-price').textContent = price;
      } else {
        console.error("No book found with id=", bookId);
      }
    }
  };
  // Updated path to fetch XML from the data folder
  xhttp.open("GET", "/data/books.xml", true);
  xhttp.send();
}

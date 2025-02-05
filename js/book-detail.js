document.addEventListener("DOMContentLoaded", function() {
  // Parse the URL parameters
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  // Using bookId, load the XML and display the appropriate book details
  loadXMLAndDisplayBook(bookId);
});

function loadXMLAndDisplayBook(bookId) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const xmlDoc = this.responseXML;

      // Use XPath or DOM methods to select the <book> element with the given id
      const query = `//book[@id='${bookId}']`;
      const result = xmlDoc.evaluate(
        query,
        xmlDoc,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (result) {
        // Extract data from the XML
        const title   = result.getElementsByTagName('title')[0].textContent;
        const cover   = result.getElementsByTagName('cover')[0].textContent;
        const summary = result.getElementsByTagName('summary')[0].textContent;
        const year    = result.getElementsByTagName('year')[0].textContent;
        const genre   = result.getElementsByTagName('genre')[0].textContent;
        const price   = result.getElementsByTagName('price')[0].textContent;

        // Author details
        const authorNode  = result.getElementsByTagName('author')[0];
        const authorName  = authorNode.getElementsByTagName('name')[0].textContent;
        const authorBio   = authorNode.getElementsByTagName('bio')[0].textContent;
        const authorPhoto = authorNode.getElementsByTagName('photo')[0].textContent;

        // Update the page elements
        document.getElementById('book-cover').src         = cover;
        document.getElementById('book-title').textContent = title;
        document.getElementById('book-author').textContent = authorName;
        document.getElementById('author-bio').textContent  = authorBio;
        document.getElementById('book-summary').textContent = summary;

        // Populate author info in the summary section
        document.getElementById('author-name2').textContent = authorName;
        document.getElementById('author-bio2').textContent  = authorBio;
        document.getElementById('author-photo').src         = authorPhoto;

        // Populate the "details" area
        document.getElementById('book-year').textContent  = year;
        document.getElementById('book-genre').textContent = genre;
        document.getElementById('book-price').textContent = price;
      } else {
        console.error("No book found with id=", bookId);
      }
    }
  };
  xhttp.open("GET", "data/books.xml", true);
  xhttp.send();
}

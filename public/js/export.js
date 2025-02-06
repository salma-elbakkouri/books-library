(async function () {
  // Get the book id from the query string
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  if (!bookId) {
    document.getElementById('transformed-content').textContent = 'No book id provided in URL.';
    return;
  }

  try {
    // Fetch the books XML file
    const xmlResponse = await fetch('/data/books.xml');
    const xmlText = await xmlResponse.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Use XPath to find the specific book with the provided id
    const xpath = `//book[@id='${bookId}']`;
    const bookNode = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!bookNode) {
      document.getElementById('transformed-content').textContent = 'Book not found.';
      return;
    }

    // Create a new XML document with <export> as the root and import the book node
    const exportDoc = document.implementation.createDocument("", "export", null);
    const importedBook = exportDoc.importNode(bookNode, true);
    exportDoc.documentElement.appendChild(importedBook);

    // Fetch the XSL file that will transform the XML to JSON
    const xslResponse = await fetch('/data/transform.xsl');
    const xslText = await xslResponse.text();
    const xslDoc = parser.parseFromString(xslText, "application/xml");

    // Transform the XML using the built-in XSLTProcessor
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    const resultFragment = xsltProcessor.transformToFragment(exportDoc, document);

    // Display the resulting JSON (inside a <pre> for formatting)
    const container = document.getElementById('transformed-content');
    container.innerHTML = "";
    container.appendChild(resultFragment);

  } catch (err) {
    console.error("Error during transformation:", err);
    document.getElementById('transformed-content').textContent = 'Error: ' + err.message;
  }
})();

// Add event listener for the copy button
document.getElementById('copy-btn').addEventListener('click', () => {
  // Get the text inside the <pre> element with id "transformed-content"
  const textToCopy = document.getElementById('transformed-content').textContent;
  
  // Use the Clipboard API to copy the text
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      // Optionally, you can provide feedback to the user here
      console.log('Text copied successfully!');
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
    });
});


// Event listener for the download button
document.getElementById('download-btn').addEventListener('click', () => {
  // Get the text from the <pre> element
  const textToDownload = document.getElementById('transformed-content').textContent;
  
  // Create a Blob from the text (here, we're assuming it's JSON; change MIME type if needed)
  const blob = new Blob([textToDownload], { type: 'application/json' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create an <a> element and trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported-book.json'; // Filename for the downloaded file
  document.body.appendChild(a);  // Append to the document for Firefox compatibility
  a.click();
  
  // Clean up by removing the element and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

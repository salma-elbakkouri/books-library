(async function () {
  // Récupérer l'id à partir l'URL
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');
  if (!bookId) {
    document.getElementById('transformed-content').textContent = 'No book id provided in URL.';
    return;
  }

  try {
    // Récupérer le fichier XML contenant les livres
    const xmlResponse = await fetch('/data/books.xml');
    const xmlText = await xmlResponse.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const xpath = `//book[@id='${bookId}']`;
    const bookNode = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!bookNode) {
      document.getElementById('transformed-content').textContent = 'Book not found.';
      return;
    }

    const exportDoc = document.implementation.createDocument("", "library", null);
    const importedBook = exportDoc.importNode(bookNode, true);
    exportDoc.documentElement.appendChild(importedBook);

    const xslResponse = await fetch('/data/transform.xsl');
    const xslText = await xslResponse.text();
    const xslDoc = parser.parseFromString(xslText, "application/xml");

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    const resultFragment = xsltProcessor.transformToFragment(exportDoc, document);

    const container = document.getElementById('transformed-content');
    container.innerHTML = "";
    container.appendChild(resultFragment);

  } catch (err) {
    console.error("Error during transformation:", err);
    document.getElementById('transformed-content').textContent = 'Error: ' + err.message;
  }
})();

document.getElementById('copy-btn').addEventListener('click', () => {
  const textToCopy = document.getElementById('transformed-content').textContent;
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      console.log('Text copied successfully!');
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
    });
});


document.getElementById('download-btn').addEventListener('click', () => {
  const textToDownload = document.getElementById('transformed-content').textContent;
  const blob = new Blob([textToDownload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exported-book.json';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

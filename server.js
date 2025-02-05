const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xml2js = require('xml2js');
const xsltProcessor = require('xslt-processor');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Configure multer to store uploaded images in public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.post('/addBook', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'authorPhoto', maxCount: 1 }
]), (req, res) => {
  const { title, year, genre, price, summary, authorName, nationality, authorBio } = req.body;

  const coverFileName = req.files['cover']
    ? '/images/' + req.files['cover'][0].filename
    : "/images/defaultCover.jpg";

  const authorPhotoFileName = req.files['authorPhoto']
    ? '/images/' + req.files['authorPhoto'][0].filename
    : "/images/defaultAuthor.jpg";

  const xmlFilePath = path.join(__dirname, 'data', 'books.xml');

  fs.readFile(xmlFilePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading XML:', readErr);
      return res.json({ success: false, error: 'Could not read XML file' });
    }

    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('XML parse error:', parseErr);
        return res.json({ success: false, error: 'Error parsing XML' });
      }

      // Ensure we access the correct XML structure
      const library = result.library || { book: [] };

      // Find the highest existing book ID and increment it
      let newId = 1;
      if (library.book && library.book.length > 0) {
        const lastBook = library.book[library.book.length - 1];
        newId = parseInt(lastBook.$.id, 10) + 1;
      }

      // New book entry
      const newBook = {
        $: { id: newId.toString() },
        title: [title],
        year: [year],
        genre: [genre],
        cover: [coverFileName],
        summary: [summary],
        price: [price],
        author: [{
          name: [authorName],
          nationality: [nationality],
          bio: [authorBio],
          photo: [authorPhotoFileName]
        }]
      };


      // Append new book to the list
      library.book.push(newBook);

      // Build the new XML while keeping <library> as root
      const builder = new xml2js.Builder();
      const newXml = builder.buildObject({ library });

      fs.writeFile(xmlFilePath, newXml, (writeErr) => {
        if (writeErr) {
          console.error('Error writing XML:', writeErr);
          return res.json({ success: false, error: 'Error writing XML file' });
        }
        console.log("New book added:", newBook);
        return res.json({ success: true, newId });
      });
    });
  });
});


// New endpoint for exporting book to PDF using only Node packages
app.get('/export-book', async (req, res) => {
  const bookId = req.query.id;
  console.log(`Received export request for book id: ${bookId}`);

  const xmlFilePath = path.join(__dirname, 'data', 'books.xml');
  fs.readFile(xmlFilePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading XML:', readErr);
      return res.status(500).send("Server error reading XML file.");
    }
    console.log('Successfully read books.xml');

    xml2js.parseString(data, async (parseErr, result) => {
      if (parseErr) {
        console.error('Error parsing XML:', parseErr);
        return res.status(500).send("Server error parsing XML file.");
      }
      console.log('Successfully parsed XML');

      // Adjust in case your XML root is <library> instead of <books>
      const books = result.library ? result.library.book : (result.books ? result.books.book : []);
      const book = books.find(b => b.$.id === bookId);
      if (!book) {
        console.error('No book found with id=', bookId);
        return res.status(404).send("Book not found.");
      }
      console.log('Book found:', book);

      // Wrap the book in a root element (<export>) for transformation
      const exportObj = { export: { book } };
      const builder = new xml2js.Builder({ headless: true });
      const exportXmlStr = builder.buildObject(exportObj);
      console.log('Export XML:', exportXmlStr);

      // Read the XSL file (assumed to be in the data folder as transform.xsl)
      const xsltPath = path.join(__dirname, 'data', 'transform.xsl');
      let xsltStr;
      try {
        xsltStr = fs.readFileSync(xsltPath, 'utf-8');
        console.log('Loaded transform.xsl');
      } catch (err) {
        console.error('Error reading XSL file:', err);
        return res.status(500).send("Error reading XSL file.");
      }

      // Parse XML and XSL strings into objects for xslt-processor
      let xmlObj, xslObj;
      try {
        xmlObj = xsltProcessor.xmlParse(exportXmlStr);
        xslObj = xsltProcessor.xmlParse(xsltStr);
      } catch (err) {
        console.error('Error parsing XML/XSL strings:', err);
        return res.status(500).send("Error parsing XML or XSL.");
      }

      // Transform XML to HTML
      let htmlStr;
      try {
        htmlStr = xsltProcessor.xsltProcess(xmlObj, xslObj);
        console.log('XSLT transformation completed.');
      } catch (err) {
        console.error('Error during XSLT transformation:', err);
        return res.status(500).send("Error during XSLT transformation.");
      }


      // Use Puppeteer to convert HTML to PDF
      (async () => {
        let browser;
        try {
          browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.setContent(htmlStr, { waitUntil: 'networkidle0' });
          const pdfBuffer = await page.pdf({ format: 'A4' });
          await browser.close();
          console.log('PDF conversion completed.');

          // Set headers for download
          res.setHeader('Content-Disposition', `attachment; filename=book-${bookId}.pdf`);
          res.setHeader('Content-Type', 'application/pdf');
          res.send(pdfBuffer);
        } catch (err) {
          console.error('Error during PDF conversion:', err);
          if (browser) await browser.close();
          return res.status(500).send("Error converting HTML to PDF.");
        }
      })();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

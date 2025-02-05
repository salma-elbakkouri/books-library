const express   = require('express');
const path      = require('path');
const fs        = require('fs');
const multer    = require('multer');
const xml2js    = require('xml2js');

const app = express();
const PORT = 3000;

// Configure multer to store uploaded images in public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    // Prefix with the field name to differentiate files (e.g., cover, authorPhoto)
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the XML data folder statically so it can be fetched by the client
app.use('/data', express.static(path.join(__dirname, 'data')));

// GET route to serve the Add Book HTML form (if needed)
app.get('/addBook', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-book.html'));
});

// POST endpoint to add a new book
app.post('/addBook', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'authorPhoto', maxCount: 1 }
]), (req, res) => {
  const { title, year, genre, price, summary, authorName, nationality, authorBio, id } = req.body;

  // Use the generated filename (stored in public/images) for the image paths
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

      // Ensure the structure exists
      if (!result.books) {
        result.books = {};
      }
      if (!result.books.book) {
        result.books.book = [];
      }

      const newBook = {
        $: { id: id },
        title: [title],
        year: [year],
        genre: [genre],
        price: [price],
        summary: [summary],
        cover: [coverFileName],
        author: [{
          name: [authorName],
          nationality: [nationality],
          bio: [authorBio],
          photo: [authorPhotoFileName]
        }]
      };

      result.books.book.push(newBook);

      const builder = new xml2js.Builder();
      const newXml = builder.buildObject(result);

      fs.writeFile(xmlFilePath, newXml, (writeErr) => {
        if (writeErr) {
          console.error('Error writing XML:', writeErr);
          return res.json({ success: false, error: 'Error writing XML file' });
        }

        console.log("New book added:", newBook);
        return res.json({ success: true });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

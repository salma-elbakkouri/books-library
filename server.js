const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xml2js = require('xml2js');

const app = express();
const PORT = 3000;

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

  if (!/^\d{4}$/.test(year)) {
    return res.json({ success: false, error: "L'année doit contenir 4 chiffres." });
  }

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

      const library = result.library || { book: [] };

      let newId = 1;
      if (library.book && library.book.length > 0) {
        const lastBook = library.book[library.book.length - 1];
        newId = parseInt(lastBook.$.id, 10) + 1;
      }

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

      library.book.push(newBook);

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

app.delete('/deleteBook', (req, res) => {
  const bookId = req.query.id;
  if (!bookId) {
    return res.status(400).json({ success: false, error: 'Book id is required' });
  }

  const xmlFilePath = path.join(__dirname, 'data', 'books.xml');

  fs.readFile(xmlFilePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading XML:', readErr);
      return res.status(500).json({ success: false, error: 'Could not read XML file' });
    }

    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('XML parse error:', parseErr);
        return res.status(500).json({ success: false, error: 'Error parsing XML' });
      }

      const library = result.library;
      if (!library || !library.book) {
        return res.status(500).json({ success: false, error: 'Invalid XML structure' });
      }

      const initialLength = library.book.length;
      library.book = library.book.filter(book => book.$.id !== bookId);

      if (library.book.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }

      const builder = new xml2js.Builder();
      const newXml = builder.buildObject({ library });

      fs.writeFile(xmlFilePath, newXml, (writeErr) => {
        if (writeErr) {
          console.error('Error writing XML:', writeErr);
          return res.status(500).json({ success: false, error: 'Error writing XML file' });
        }
        console.log(`Book with id ${bookId} deleted.`);
        return res.json({ success: true });
      });
    });
  });
});


app.get('/getBook', (req, res) => {
  const bookId = req.query.id;
  console.log(`Fetching book with id: ${bookId}`);
  if (!bookId) {
    return res.status(400).json({ success: false, error: 'Book id is required' });
  }

  const xmlFilePath = path.join(__dirname, 'data', 'books.xml');

  fs.readFile(xmlFilePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading XML:', readErr);
      return res.status(500).json({ success: false, error: 'Could not read XML file' });
    }

    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('XML parse error:', parseErr);
        return res.status(500).json({ success: false, error: 'Error parsing XML' });
      }

      const library = result.library;
      if (!library || !library.book) {
        return res.status(500).json({ success: false, error: 'Invalid XML structure' });
      }

      const book = library.book.find(b => b.$.id === bookId);
      if (!book) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }
      return res.json({ success: true, data: book });
    });
  });
});


app.post('/editBook', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'authorPhoto', maxCount: 1 }
]), (req, res) => {
  const { id, title, year, genre, price, summary, authorName, nationality, authorBio } = req.body;

  if (!/^\d{4}$/.test(year)) {
    return res.json({ success: false, error: "L'année doit contenir 4 chiffres." });
  }

  if (!id) {
    return res.status(400).json({ success: false, error: 'Book id is required' });
  }

  const xmlFilePath = path.join(__dirname, 'data', 'books.xml');

  fs.readFile(xmlFilePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading XML:', readErr);
      return res.status(500).json({ success: false, error: 'Could not read XML file' });
    }
    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        console.error('XML parse error:', parseErr);
        return res.status(500).json({ success: false, error: 'Error parsing XML' });
      }

      const library = result.library;
      if (!library || !library.book) {
        return res.status(500).json({ success: false, error: 'Invalid XML structure' });
      }

      const bookIndex = library.book.findIndex(b => b.$.id === id);
      if (bookIndex === -1) {
        return res.status(404).json({ success: false, error: 'Book not found' });
      }

      const book = library.book[bookIndex];
      book.title = [title];
      book.year = [year];
      book.genre = [genre];
      book.price = [price];
      book.summary = [summary];

      if (req.files && req.files['cover'] && req.files['cover'][0]) {
        book.cover = ['/images/' + req.files['cover'][0].filename];
      }
      if (!book.author || !book.author[0]) {
        book.author = [{}];
      }
      book.author[0].name = [authorName];
      book.author[0].nationality = [nationality];
      book.author[0].bio = [authorBio];
      if (req.files && req.files['authorPhoto'] && req.files['authorPhoto'][0]) {
        book.author[0].photo = ['/images/' + req.files['authorPhoto'][0].filename];
      }

      const builder = new xml2js.Builder();
      const newXml = builder.buildObject({ library });
      fs.writeFile(xmlFilePath, newXml, (writeErr) => {
        if (writeErr) {
          console.error('Error writing XML:', writeErr);
          return res.status(500).json({ success: false, error: 'Error writing XML file' });
        }
        console.log(`Book with id ${id} updated successfully.`);
        return res.json({ success: true });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

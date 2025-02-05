document.addEventListener("DOMContentLoaded", () => {
    // If we are on the Book Details Page:
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
      // The page has an edit button, so assume it's the details page.
      editBtn.addEventListener("click", () => {
        // Get the current book's id from the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get("id");
  
        if (bookId) {
          // Simply redirect to the edit page
          window.location.href = `edit-book.html?id=${bookId}`;
        } else {
          alert("Book ID not found.");
        }
      });
    }
  
    // If we are on the Edit Page:
    const editBookForm = document.getElementById("editBookForm");
    if (editBookForm) {
      // We assume that if the edit form exists, we're on the edit page.
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get("id");
      if (!bookId) {
        alert("No book ID provided");
        return;
      }
  
      // Fetch and pre-fill the form with the book's current data
      fetch(`/getBook?id=${bookId}`)
        .then(response => response.json())
        .then(book => {
          if (!book.success) {
            alert("Error fetching book details: " + book.error);
            return;
          }
          // Pre-fill form fields with existing data
          document.getElementById("title").value = book.data.title[0];
          document.getElementById("year").value = book.data.year[0];
          document.getElementById("genre").value = book.data.genre[0];
          document.getElementById("price").value = book.data.price[0];
          document.getElementById("summary").value = book.data.summary[0];
  
          // Author details
          document.getElementById("authorName").value = book.data.author[0].name[0];
          document.getElementById("nationality").value = book.data.author[0].nationality[0];
          document.getElementById("authorBio").value = book.data.author[0].bio[0];
  
          // Set the src for current images (if available)
          document.getElementById("currentCover").src = book.data.cover[0];
          document.getElementById("currentAuthorPhoto").src = book.data.author[0].photo[0];
        })
        .catch(err => {
          console.error("Error fetching book data:", err);
          alert("Error fetching book data.");
        });
  
      // Handle form submission for updating book information
      editBookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const year = document.getElementById("year").value;
        if (!/^\d{4}$/.test(year)) {
            alert("⚠️ Year must be 4 digits (e.g., 2025)");
            return;
        }

        if (!confirm("Are you sure you want to save these changes?")) {
          return;
        }
  
        // Gather updated form values
        const formData = new FormData();
        formData.append("id", bookId);
        formData.append("title", document.getElementById("title").value);
        formData.append("year", document.getElementById("year").value);
        formData.append("genre", document.getElementById("genre").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("summary", document.getElementById("summary").value);
        formData.append("authorName", document.getElementById("authorName").value);
        formData.append("nationality", document.getElementById("nationality").value);
        formData.append("authorBio", document.getElementById("authorBio").value);
  
        // Append new cover file if selected
        const coverInput = document.getElementById("cover");
        if (coverInput.files[0]) {
          formData.append("cover", coverInput.files[0]);
        }
  
        // Append new author photo if selected
        const authorPhotoInput = document.getElementById("authorPhoto");
        if (authorPhotoInput.files[0]) {
          formData.append("authorPhoto", authorPhotoInput.files[0]);
        }
  
        // Send updated data to the server
        fetch("/editBook", {
          method: "POST", // You can also use PUT if you prefer
          body: formData
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert("Book updated successfully!");
              window.location.href = "index.html"; // Redirect to index or book details page
            } else {
              alert("Error updating book: " + result.error);
            }
          })
          .catch(err => {
            console.error("Error updating book:", err);
            alert("An unexpected error occurred.");
          });
      });
    }
    // Add cancel button functionality
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (bookId) {
        window.location.href = `book-detail.html?id=${bookId}`;
    } else {
        window.location.href = 'index.html';
    }
    });
    }
    });
  
document.addEventListener("DOMContentLoaded", () => {
  const addBookForm = document.getElementById("addBookForm");

  addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const yearPublication = document.getElementById("year").value;

    if (!/^\d{4}$/.test(yearPublication)) {
      alert("⚠️ Year must be 4 digits (e.g., 2025)");
      return; // Bloquer l'envoi
    }

    // Confirmation box
    if (!confirm("Are you sure you want to add this book?")) {
      return;
    }

    // Gather form values
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const genre = document.getElementById("genre").value;
    const price = document.getElementById("price").value;
    const summary = document.getElementById("summary").value;
    const authorName = document.getElementById("authorName").value;
    const nationality = document.getElementById("nationality").value;
    const authorBio = document.getElementById("authorBio").value;

    // File inputs
    const coverInput = document.getElementById("cover");
    const authorPhotoInput = document.getElementById("authorPhoto");

    // Generate unique ID
    const id = Date.now();

    // Create FormData object
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("year", year);
    formData.append("genre", genre);
    
    // Ensure cover is appended before price
    if (coverInput.files[0]) {
      formData.append("cover", coverInput.files[0]);
    }
    
    formData.append("summary", summary);
    formData.append("price", price);

    // Author details
    formData.append("authorName", authorName);
    formData.append("nationality", nationality);
    formData.append("authorBio", authorBio);

    // Append author photo
    if (authorPhotoInput.files[0]) {
      formData.append("authorPhoto", authorPhotoInput.files[0]);
    }

    // Send form data to server
    fetch("/addBook", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log("Book added successfully!");
          window.location.href = "index.html";
        } else {
          console.error("Error adding book:", result.error);
          alert("Error adding book: " + result.error);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert("An unexpected error occurred.");
      });
  });
});

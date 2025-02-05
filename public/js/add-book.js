document.addEventListener("DOMContentLoaded", () => {
  const addBookForm = document.getElementById("addBookForm");

  addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Confirmation box
    if (!confirm("Are you sure you want to add this book?")) {
      return;
    }

    // Gather form values
    const title       = document.getElementById("title").value;
    const year        = document.getElementById("year").value;
    const genre       = document.getElementById("genre").value;
    const price       = document.getElementById("price").value;
    const summary     = document.getElementById("summary").value;
    const authorName  = document.getElementById("authorName").value;
    const nationality = document.getElementById("nationality").value;
    const authorBio   = document.getElementById("authorBio").value;

    // For file inputs
    const coverInput      = document.getElementById("cover");
    const authorPhotoInput = document.getElementById("authorPhoto");

    // Generate a unique ID using Date.now()
    const id = Date.now();

    // Create a FormData object
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("year", year);
    formData.append("genre", genre);
    formData.append("price", price);
    formData.append("summary", summary);
    formData.append("authorName", authorName);
    formData.append("nationality", nationality);
    formData.append("authorBio", authorBio);

    // Append file data if available
    if (coverInput.files[0]) {
      formData.append("cover", coverInput.files[0]);
    }
    if (authorPhotoInput.files[0]) {
      formData.append("authorPhoto", authorPhotoInput.files[0]);
    }

    // Send the form data to the server
    fetch("/addBook", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log("Book added successfully!");
        // Redirect to main page to see the updated list of books
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

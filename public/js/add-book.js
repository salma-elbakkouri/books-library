document.addEventListener("DOMContentLoaded", () => {
  const addBookForm = document.getElementById("addBookForm");

  addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const yearPublication = document.getElementById("year").value;

    if (!/^\d{4}$/.test(yearPublication)) {
      alert("⚠️ Year must be 4 digits (e.g., 2025)");
      return;
    }

    if (!confirm("Are you sure you want to add this book?")) {
      return;
    }

    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const genre = document.getElementById("genre").value;
    const price = document.getElementById("price").value;
    const summary = document.getElementById("summary").value;
    const authorName = document.getElementById("authorName").value;
    const nationality = document.getElementById("nationality").value;
    const authorBio = document.getElementById("authorBio").value;

    const coverInput = document.getElementById("cover");
    const authorPhotoInput = document.getElementById("authorPhoto");

    // Generate ID
    const id = Date.now();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("year", year);
    formData.append("genre", genre);

    if (coverInput.files[0]) {
      formData.append("cover", coverInput.files[0]);
    }

    formData.append("summary", summary);
    formData.append("price", price);

    formData.append("authorName", authorName);
    formData.append("nationality", nationality);
    formData.append("authorBio", authorBio);

    if (authorPhotoInput.files[0]) {
      formData.append("authorPhoto", authorPhotoInput.files[0]);
    }

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

document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});

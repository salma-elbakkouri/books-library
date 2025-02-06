document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.querySelector('.delete-btn');
  
    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm("Are you sure you want to delete this book?");
      if (!confirmDelete) return;
  
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get('id');
      if (!bookId) {
        alert("Book ID not found.");
        return;
      }
  
      try {
        const response = await fetch(`/deleteBook?id=${bookId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          alert("Book deleted successfully.");
          window.location.href = "index.html";
        } else {
          const errorData = await response.json();
          alert("Error deleting book: " + errorData.error);
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the book.");
      }
    });
  });
  
document.addEventListener("DOMContentLoaded", () => {
    const books = document.querySelector(".books");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");

    let index = 0;
    const bookWidth = document.querySelector(".book-card").offsetWidth + 20; // Including margin
    const visibleBooks = 5; 

    next.addEventListener("click", () => {
        if (index < books.children.length - visibleBooks) {
            index++;
            books.style.transform = `translateX(-${index * bookWidth}px)`;
        }
    });

    prev.addEventListener("click", () => {
        if (index > 0) {
            index--;
            books.style.transform = `translateX(-${index * bookWidth}px)`;
        }
    });
});

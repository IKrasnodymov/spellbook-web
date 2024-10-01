document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Spellbook Puzzle Web Demo is loaded!');

    const gameBoard = document.querySelector('.game-board');
    const scoreElement = document.getElementById('score');
    let score = 0;
    const elements = ['🔥', '💧', '🌍', '💨'];
    let selectedBook = null;

    function createBook() {
        const book = document.createElement('div');
        book.className = 'book';
        book.textContent = elements[Math.floor(Math.random() * elements.length)];
        book.addEventListener('click', () => selectBook(book));
        return book;
    }

    function selectBook(book) {
        if (selectedBook === null) {
            selectedBook = book;
            book.style.border = '2px solid #ffff00';
        } else if (selectedBook === book) {
            selectedBook.style.border = '2px solid #9b4dca';
            selectedBook = null;
        } else {
            swapBooks(selectedBook, book);
            selectedBook.style.border = '2px solid #9b4dca';
            selectedBook = null;
        }
    }

    function swapBooks(book1, book2) {
        const tempContent = book1.textContent;
        book1.textContent = book2.textContent;
        book2.textContent = tempContent;

        score += 10;
        updateScore();

        // Simple match check (for demonstration purposes)
        checkForMatches();
    }

    function checkForMatches() {
        const books = document.querySelectorAll('.book');
        books.forEach((book, index) => {
            if (index % 4 < 2 && book.textContent === books[index + 1].textContent && book.textContent === books[index + 2].textContent) {
                book.textContent = elements[Math.floor(Math.random() * elements.length)];
                books[index + 1].textContent = elements[Math.floor(Math.random() * elements.length)];
                books[index + 2].textContent = elements[Math.floor(Math.random() * elements.length)];
                score += 50;
                updateScore();
            }
        });
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    // Initialize game board
    for (let i = 0; i < 16; i++) {
        gameBoard.appendChild(createBook());
    }

    // Add a simple animation to the screenshots
    const screenshots = document.querySelectorAll('.app-screenshots img');
    screenshots.forEach((img, index) => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 300 * (index + 1));
    });

    // Add hover effect to feature list items
    const featureItems = document.querySelectorAll('.features li');
    featureItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            item.style.color = '#9b4dca';
        });
        item.addEventListener('mouseout', () => {
            item.style.color = '#f0e6ff';
        });
    });
});
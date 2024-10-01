document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Spellbook Puzzle Web Demo is loaded!');

    const gameBoard = document.querySelector('.game-board');
    const scoreElement = document.getElementById('score');
    let score = 0;
    const elements = ['fire', 'water', 'earth', 'air'];
    let selectedBook = null;
    const GRID_SIZE = 3;

    function createBook(element = null) {
        const book = document.createElement('div');
        book.className = 'book';
        element = element || elements[Math.floor(Math.random() * elements.length)];
        book.innerHTML = `<img src="assets/images/${element}_book.png" alt="${element} book">`;
        book.dataset.element = element;
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
        const tempHTML = book1.innerHTML;
        const tempElement = book1.dataset.element;
        book1.innerHTML = book2.innerHTML;
        book1.dataset.element = book2.dataset.element;
        book2.innerHTML = tempHTML;
        book2.dataset.element = tempElement;

        checkForMatches();
    }

    function checkForMatches() {
        const books = document.querySelectorAll('.book');
        let matched = false;

        // Check horizontal matches
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += GRID_SIZE) {
            if (books[i].dataset.element === books[i+1].dataset.element && 
                books[i].dataset.element === books[i+2].dataset.element) {
                matched = true;
                replaceBooks(books[i], books[i+1], books[i+2]);
            }
        }

        // Check vertical matches
        for (let i = 0; i < GRID_SIZE; i++) {
            if (books[i].dataset.element === books[i+GRID_SIZE].dataset.element && 
                books[i].dataset.element === books[i+GRID_SIZE*2].dataset.element) {
                matched = true;
                replaceBooks(books[i], books[i+GRID_SIZE], books[i+GRID_SIZE*2]);
            }
        }

        if (matched) {
            score += 1;
            updateScore();
            setTimeout(() => {
                dropBooks();
                setTimeout(checkForMatches, 300);
            }, 300);
        }
    }

    function replaceBooks(...books) {
        books.forEach(book => {
            book.dataset.element = 'empty';
            book.innerHTML = '';
            book.style.opacity = '0';
        });
    }

    function dropBooks() {
        const books = document.querySelectorAll('.book');
        let dropped = false;

        for (let col = 0; col < GRID_SIZE; col++) {
            let emptySpaces = 0;
            for (let row = GRID_SIZE - 1; row >= 0; row--) {
                const index = row * GRID_SIZE + col;
                if (books[index].dataset.element === 'empty') {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const newIndex = (row + emptySpaces) * GRID_SIZE + col;
                    books[newIndex].innerHTML = books[index].innerHTML;
                    books[newIndex].dataset.element = books[index].dataset.element;
                    books[index].innerHTML = '';
                    books[index].dataset.element = 'empty';
                    dropped = true;
                }
            }
        }

        // Fill empty spaces at the top with new books
        for (let col = 0; col < GRID_SIZE; col++) {
            for (let row = 0; row < GRID_SIZE; row++) {
                const index = row * GRID_SIZE + col;
                if (books[index].dataset.element === 'empty') {
                    const newBook = createBook();
                    books[index].innerHTML = newBook.innerHTML;
                    books[index].dataset.element = newBook.dataset.element;
                    books[index].style.opacity = '1';
                    animateBookFall(books[index], row);
                }
            }
        }

        return dropped;
    }

    function animateBookFall(book, row) {
        book.style.transform = `translateY(-${(row + 1) * 100}%)`;
        setTimeout(() => {
            book.style.transition = 'transform 0.3s ease-in';
            book.style.transform = 'translateY(0)';
        }, 50);
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    // Initialize game board
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
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
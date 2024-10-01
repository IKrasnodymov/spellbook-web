document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Spellbook Puzzle Web Demo is loaded!');

    const gameBoard = document.querySelector('.game-board');
    const scoreElement = document.getElementById('score');
    let score = 0;
    const elements = ['fire', 'water', 'earth', 'air'];
    let selectedBook = null;

    function createBook() {
        const book = document.createElement('div');
        book.className = 'book';
        const element = elements[Math.floor(Math.random() * elements.length)];
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

        score += 10;
        updateScore();

        checkForMatches();
    }

    function checkForMatches() {
        const books = document.querySelectorAll('.book');
        let matched = false;

        // Check horizontal matches
        for (let i = 0; i < 16; i += 4) {
            if (books[i].dataset.element === books[i+1].dataset.element && 
                books[i].dataset.element === books[i+2].dataset.element) {
                matched = true;
                replaceBooks(books[i], books[i+1], books[i+2]);
            }
        }

        // Check vertical matches
        for (let i = 0; i < 4; i++) {
            if (books[i].dataset.element === books[i+4].dataset.element && 
                books[i].dataset.element === books[i+8].dataset.element) {
                matched = true;
                replaceBooks(books[i], books[i+4], books[i+8]);
            }
        }

        if (matched) {
            score += 50;
            updateScore();
            setTimeout(dropBooks, 300);
        }
    }

    function replaceBooks(...books) {
        books.forEach(book => {
            const element = elements[Math.floor(Math.random() * elements.length)];
            book.innerHTML = `<img src="assets/images/${element}_book.png" alt="${element} book">`;
            book.dataset.element = element;
            book.style.opacity = '0';
            setTimeout(() => book.style.opacity = '1', 200);
        });
    }

    function dropBooks() {
        const books = document.querySelectorAll('.book');
        let dropped = false;

        for (let i = 12; i < 16; i++) {
            for (let j = i; j >= 4; j -= 4) {
                if (books[j].dataset.element === 'empty') {
                    books[j].innerHTML = books[j-4].innerHTML;
                    books[j].dataset.element = books[j-4].dataset.element;
                    books[j-4].innerHTML = '';
                    books[j-4].dataset.element = 'empty';
                    dropped = true;
                }
            }
        }

        if (dropped) {
            setTimeout(dropBooks, 300);
        } else {
            fillEmptySpaces();
            checkForMatches();
        }
    }

    function fillEmptySpaces() {
        const books = document.querySelectorAll('.book');
        books.forEach(book => {
            if (book.dataset.element === 'empty') {
                const element = elements[Math.floor(Math.random() * elements.length)];
                book.innerHTML = `<img src="assets/images/${element}_book.png" alt="${element} book">`;
                book.dataset.element = element;
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
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Spellbook Puzzle Web Demo is loaded!');

    const gameBoard = document.querySelector('.game-board');
    const scoreElement = document.getElementById('score');
    let score = 0;
    const elements = ['fire', 'water', 'earth', 'air'];
    let selectedBook = null;

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
            book.dataset.element = 'empty';
            book.innerHTML = '';
            book.style.opacity = '0';
        });
    }

    function dropBooks() {
        const books = document.querySelectorAll('.book');
        let dropped = false;

        for (let col = 0; col < 4; col++) {
            let emptySpaces = 0;
            for (let row = 3; row >= 0; row--) {
                const index = row * 4 + col;
                if (books[index].dataset.element === 'empty') {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const newIndex = (row + emptySpaces) * 4 + col;
                    books[newIndex].innerHTML = books[index].innerHTML;
                    books[newIndex].dataset.element = books[index].dataset.element;
                    books[index].innerHTML = '';
                    books[index].dataset.element = 'empty';
                    dropped = true;
                }
            }
            // Fill top empty spaces with new books
            for (let i = 0; i < emptySpaces; i++) {
                const index = i * 4 + col;
                const newBook = createBook();
                books[index].innerHTML = newBook.innerHTML;
                books[index].dataset.element = newBook.dataset.element;
            }
        }

        if (dropped) {
            setTimeout(checkForMatches, 300);
        }
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
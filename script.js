// Define the Book class
class Book {
    constructor(title, author, isbn, genre, count, availability = true) {
        // Private properties
        let _title = title;
        let _author = author;
        let _isbn = isbn;
        let _genre = genre;
        let _count = count;
        let _availability = availability;

        // Getter methods
        this.getTitle = () => _title;
        this.getAuthor = () => _author;
        this.getISBN = () => _isbn;
        this.getGenre = () => _genre;
        this.getCount = () => _count;
        this.getAvailability = () => _availability;

        // Setter methods
        this.setTitle = (newTitle) => { _title = newTitle; };
        this.setAuthor = (newAuthor) => { _author = newAuthor; };
        this.setISBN = (newISBN) => { _isbn = newISBN; };
        this.setGenre = (newGenre) => { _genre = newGenre; };
        this.setCount = (newCount) => { _count = newCount };
        this.setAvailability = (newAvailability) => { _availability = newAvailability; };
    }
}
// Define the ReferenceBook class extending from Book
class ReferenceBook extends Book {
    constructor(title, author, isbn, genre, availability, edition) {
        // Call the constructor of the parent class (Book)
        super(title, author, isbn, genre, availability);
        this.edition = edition;
    }

    // Method to display the edition of the reference book
    displayEdition() {
        console.log(`Edition: ${this.edition}`);
    }
}

// Define the LibraryCatalog class
class LibraryCatalog {
    constructor() {
        this.books = JSON.parse(localStorage.getItem('libraryCatalog')) || [];
        this.checkedOutCount = 0; // Initialize checked out count
    }

    // Method to add a book to the catalog
    addBook(book) {
        book.setAvailability(true); // Set availability to true for newly added books
        this.books.push(book);
        this.updateLocalStorage();
        this.displayBooks();
    }

 // Method to remove a book from the catalog
 removeBook(isbn) {
    this.books = this.books.filter(book => book.isbn !== isbn);
    this.updateLocalStorage();
    this.displayBooks();
    refreshSearchResults(); // Call refreshSearchResults to update search results
}




    // Method to update local storage with the current book catalog
    updateLocalStorage() {
        localStorage.setItem('libraryCatalog', JSON.stringify(this.books));
    }

    // Method to display all books in the catalog
    displayBooks() {
        const bookList = document.getElementById("book-list");
        bookList.innerHTML = '';
        this.books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Not Available'}</p>
                <button onclick="removeBook('${book.isbn}')">Remove</button>
                <button onclick="showBookDetails('${book.isbn}')">Details</button>
                <button onclick="checkoutBook('${book.isbn}')">Checkout</button>
                <button onclick="returnBook('${book.isbn}')">Return</button>
            `;
            bookList.appendChild(bookItem);
        });
    }

    // Method to search for books by title, author, genre, or ISBN
    searchBooks(keyword, searchType) {
        const filteredBooks = this.books.filter(book =>
            book[searchType].toLowerCase().includes(keyword.toLowerCase())
        );
        return filteredBooks; // Return the filtered books
    }

    // Method to display book details
    displayBookDetails(isbn) {
        const book = this.books.find(book => book.isbn === isbn);
        if (book) {
            alert(`Title: ${book.title}\nAuthor: ${book.author}\nISBN: ${book.isbn}\nGenre: ${book.genre}\nAvailability: ${book.availability ? 'Available' : 'Not Available'}`);
        } else {
            alert('Book not found.');
        }
    }

    // Method to checkout a book
    checkoutBook(isbn) {
        const book = this.books.find(book => book.isbn === isbn);
        if (book) {
            if (book.count > 0) {
                book.count--;
                book.availability = book.count > 0;
                this.checkedOutCount++; // Increment checked out count
                this.updateLocalStorage();
                this.displayBooks();
                alert(`Book ${book.title} has been checked out.`);
            } else {
                alert('No copies available for checkout.');
            }
        } else {
            alert('Book not found.');
        }
    }

    // Method to return a book
    returnBook(isbn) {
        const book = this.books.find(book => book.isbn === isbn);
        if (book) {
            if (this.checkedOutCount > 0) { // Ensure there are checked out books
                book.count++;
                book.availability = true;
                this.checkedOutCount--; // Decrement checked out count
                this.updateLocalStorage();
                this.displayBooks();
                alert(`Book "${book.title}" has been returned.`);
            } else {
                alert('No books are currently checked out.');
            }
        } else {
            alert('Book not found.');
        }
    }
}

function refreshSearchResults() {
    document.getElementById('search-btn').click(); // Simulate a click on the search button
}

// Function to remove a book
function removeBook(isbn) {
    libraryCatalog.removeBook(isbn);
}

// Function to show book details
function showBookDetails(isbn) {
    libraryCatalog.displayBookDetails(isbn);
}

// Function to checkout a book
function checkoutBook(isbn) {
    libraryCatalog.checkoutBook(isbn);
    refreshSearchResults();
}

// Function to return a book
function returnBook(isbn) {
    libraryCatalog.returnBook(isbn);
    refreshSearchResults();
}

// Create an instance of the LibraryCatalog class
const libraryCatalog = new LibraryCatalog();

// Display existing books
libraryCatalog.displayBooks();



// Event listener for searching books dynamically while typing
document.getElementById('search').addEventListener('input', function() {
    const keyword = this.value.toLowerCase(); // Get the input value
    const searchType = document.getElementById('search-type').value; // Get the search type

    // Check if the keyword is not empty
    if (keyword.trim() !== '') {
        // Filter books based on the keyword and search type
        const searchResults = libraryCatalog.searchBooks(keyword, searchType);

        // Display the search results dynamically
        displaySearchResults(searchResults);
    } else {
        // If the keyword is empty, clear the search results container
        clearSearchResults();
    }
});

// Function to display search results dynamically
function displaySearchResults(books) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous search results

    if (books.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
    } else {
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
                <p><b>Title:</b> ${book.title}</p>
                <p><b>Author:</b> ${book.author}</p>
                <p><b>ISBN:</b> ${book.isbn}</p>
                <p><b>Genre: </b>${book.genre}</p>
                <p><b>Availability:</b> ${book.availability ? 'Available' : 'Not Available'}</p>
                <button onclick="showBookDetails('${book.isbn}')">Details</button>
                <button onclick="removeBook('${book.isbn}')">Remove</button>
                <button onclick="checkoutBook('${book.isbn}')">Checkout</button>
                <button onclick="returnBook('${book.isbn}')">Return</button>`;
            searchResultsContainer.appendChild(bookItem);
        });
    }
}


// Function to clear search results
function clearSearchResults() {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear search results container
}


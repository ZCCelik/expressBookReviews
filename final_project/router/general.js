const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

//Get all books using promises
public_users.get('/', function (req, res) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 600); 
  });

  promise
    .then((result) => {
      return res.status(200).json({ books: result });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Failed to fetch books" });
    });
});


// Get books details based on ISBN with promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const promise = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book); // Resolve with the book details
    } else {
      reject("Book not found");
    }
  });

  promise
    .then((bookDetails) => {
      res.status(200).json(bookDetails);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const promise = new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for this author");
    }
  });

  promise
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const promise = new Promise((resolve, reject) => {
    const booksWithTitle = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title
    );

    if (booksWithTitle.length > 0) {
      resolve(booksWithTitle);
    } else {
      reject("No books found with this title");
    }
  });

  promise
    .then((result) => {
      res.status(200).json(result); // Send the resolved books data
    })
    .catch((error) => {
      res.status(404).json({ error }); // Send the error message if rejected
    });
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    if (book.reviews && book.reviews.length > 0) {
      res.send(book.reviews);
    } else {
      res.status(404).send({ error: 'No reviews found for this book' });
    }
  } else {
    res.status(404).send({ error: 'Book not found' });
  }
});
  

module.exports.general = public_users;
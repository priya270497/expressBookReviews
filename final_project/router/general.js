const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', function(req, res) {
    const { username, password } = req.body;
  
    // Check if both fields are provided
    if (!username || !password) {
      res.status(400).send('Please provide both username and password');
      return;
    }
  
    // Check if username already exists
    if (users[username]) {
      res.status(409).send('Username already exists');
      return;
    }
  
    // Register new user
    users[username] = {
      username,
      password
    };
  
    res.send('Registration successful');
  });
  
  

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('https://example.com/book-list');
      const books = response.data;
  
      return res.json(books);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch book list' });
    }
  });

  public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`https://example.com/book-details/${isbn}`);
      const book = response.data;
  
      if (book) {
        return res.json(book);
      } else {
        return res.send(`No book found for ISBN '${isbn}'`);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`https://example.com/book-details?author=${author}`);
      const books = response.data;
      if (books.length > 0) {
        return res.json(books);
      } else {
        return res.send(`No books found for author '${author}'`);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get(`https://example.com/book-details?title=${title}`);
      const book = response.data;
      if (book) {
        return res.json(book);
      } else {
        return res.send("Book not found");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let bookReviews = null;
    for (let id in books) {
      if (books[id].isbn === isbn) {
        bookReviews = books[id].reviews;
        break;
      }
    }
    if (bookReviews) {
      res.send(JSON.stringify(bookReviews, null, 2));
    } else {
      res.send("Reviews not found for the book");
    }
  });

module.exports.general = public_users;

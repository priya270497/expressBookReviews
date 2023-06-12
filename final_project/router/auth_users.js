const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{'username':'test', 'password':'test@123'}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}
  
const authenticatedUser = (username, password) => {
    const users = users.find(u => u.username === username && u.password === password);
    return !!user;
}
  

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
    const review = req.query.review;
  
    // Find the book with the given ISBN
    const book = books.find(b => b.isbn === isbn);
  
    if (!book) {
      // If the book doesn't exist, return an error message
      return res.status(404).json({message: "Book not found"});
    }
  
    // Check if the user has already posted a review for the book
    const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
  
    if (existingReviewIndex !== -1) {
      // If the user has already posted a review, update the review
      book.reviews[existingReviewIndex].review = review;
      return res.status(200).json({message: "Review updated successfully!"});
    } else {
      // If the user hasn't posted a review, add a new review
      book.reviews.push({username, review});
      return res.status(200).json({message: "Review added successfully!"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

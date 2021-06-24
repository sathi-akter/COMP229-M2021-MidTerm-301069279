// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    res.render('books/details', {
      title: "Add a new Book",
      books: "",
      displayName: req.user ? req.user.displayName : 'Guest'
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let myBook = book({
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.create(myBook, (error) => {
      if (error) {
        console.error(error);
        res.end(error);
      } else {
        res.redirect('/books');
      }
    });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    try {
      let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

      book.findById(id, (error, books) => {
        if(error) {
          console.error(error);
          res.end(error);
        } else {
          res.render('books/details', {
            title: "Edit Book Details",
            books: books,
            displayName: req.user ? req.user.displayName : 'Guest'
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.redirect( '/errors/404');
    }

});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let id = req.params.id;

    let updatedBook = book({
      "_id": id,
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.update({_id: id}, updatedBook, (error) => {
      if (error) {
        console.error(error);
        res.end(error);
      } else {
        res.redirect('/books');
      }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let id = req.params.id;

    book.remove({_id: id}, (error) => {
      if (error) {
        console.error(error);
        res.end(error);
      } else {
        res.redirect('/books');
      }
    });
});


module.exports = router;

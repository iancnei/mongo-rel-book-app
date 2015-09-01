var express = require("express"),
    bodyParser = require("body-parser"),
    path = require("path"),
    db = require("./models");

var app = express(),
    views = path.join(__dirname, "views");

app.use(bodyParser.urlencoded({extended: true}));

// tell our application what our
// assets are
app.use("/static", express.static("public"));
app.use("/vendor", express.static("bower_components"));




app.get("/", function (req, res) {
  var homePath = path.join(views, "home.html");
  res.sendFile(homePath);
});

app.get("/books", function (req, res) {
    db.Book.find({},
        function (err, books) {

            res.send(books);
        });
});

// The POST route receives an object that contains the _id, comment, and person in req.body.
app.post("/books", function(req, res)
{
    //console.log(req.body);
    // We find the book we want to add the comment to by matching the id.
    db.Book.findOne({_id: req.body._id}, function (err, book) {
        if(err) 
        {
            return console.log(err);
        }
        // We create a new comment populated by the comment and person from req.body.
        var newComment = {
            comment: req.body.comment,
            person: req.body.person
        };
        // We push the newly created comment into the book's comment array.
        book.comments.push(newComment);
        // Save the book after the comment is added.
        book.save(function(err, success) {
            if(err) {return console.log(err);}
            //console.log("Comment added Successfully");
            res.send(newComment);
        });
    })
});

// The DELETE route receives an object that contains the id of the book and the comment in one string with a "=" separator between two in req.body.
app.delete("/books", function(req, res)
{
    // Split the two ids so we can easily access each one in an array (the book id is first followed by the comment id).
    var ids = req.body._id.toString().split("="); 
    // We find the book with the comment we want to delete using the book id.
    db.Book.findOne({_id: ids[0]}, function (err, book) { 
        if(err)
        {
            return console.log(err);
        }
        // We walk through the book's comment array checking the ids for the comment we want to delete.
        for(var i = 0; i < book.comments.length; i++)
        {
            // The id of the comment we want is stored as a string, so we convert the id of the comment into a string to easily compare the two
            if(book.comments[i]._id.toString() === ids[1]) 
            {
                //console.log("match found");
                // When it's found, we remove the comment from the array.
                book.comments[i].remove();
                // We've removed the comment we wanted to remove, so we don't need to check any more of the array, so we break out of the loop.
                break; 
            }
        }
        //console.log(book.comments);
        // We save the book after the comment has been removed.
        book.save(function(err, success) {
            if(err) {return console.log(err);}
            res.send(success);
        });
    })

});

app.listen(3000, function() {
    console.log("Server is now listening on localhost:3000");
})

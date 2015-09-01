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

app.post("/books", function(req, res)
{
    //console.log(req.body);
    db.Book.findOne({_id: req.body._id}, function (err, book) {
        if(err) {return console.log(err);}
        var newComment = {
            comment: req.body.comment,
            person: req.body.person
        };
        book.comments.push(newComment);
        book.save(function(err, success) {
            if(err) {return console.log(err);}
            console.log("Comment added Successfully");
            res.send(newComment);
        });
    })

});

app.delete("/books", function(req, res)
{
    var ids = req.body._id.toString().split("=");
    db.Book.findOne({_id: ids[0]}, function (err, book) {
        if(err) {return console.log(err);}
        /* To remove ANY embedded document, simplly call .remove(); */
        //book.comments[0].remove();
        for(var i = 0; i < book.comments.length; i++)
        {
            if(book.comments[i]._id.toString() === ids[1])
            {
                //console.log("match found");
                book.comments[i].remove();
                break;
            }
        }
        //console.log(book.comments);
        book.save(function(err, success) {
            if(err) {return console.log(err);}
            res.send(success);
        });
    })

});

app.listen(3000, function() {
    console.log("Server is now listening on localhost:3000");
})

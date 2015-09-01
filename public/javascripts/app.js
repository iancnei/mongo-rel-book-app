// onClick function when the Post Comment button or "the "Enter" key is pressed. We set data equal to that long string that now contains the id, the comment, and the username/person.
function sendComment(context)
{
    // We take the id of the button which is equivalent to the mongoDB _id of the book it is related to.
    var id = context.id;
    // We take the comment and username/person from the form that the button resides in.
    var data = $("#" + id + "form").serialize();
    // We append that id to the comment and username alongside an "&_id=" so that when it is received in the POST route ,the id gets added as an attribute just like the comment and the username/person.
    data += "&_id=" + id;
    //console.log(data);
    // We append a "#" to make the id variable easier to use with jQuery as an element selector.
    id = "#" + context.id;
    // We send that data in a POST request to the backend.
    $.post("/books", data)
    .done(
        function(response)
        {
            // We reset the comment and username fields after you submit the POST.  Note: This is actually unnecessary since we get rid of everything on the page and then re-render everything with a call to renderBooks(). This does create a problem if someone has multiple comments in multiple book comment fields but hasn't posted them since those comments will be lost when the page is re-rendered.  That's a very odd edge case though ┐('～`；)┌ .
            $(id + "form")[0].reset(); 
            // We re-render the book info after the POST request is done.
            renderBooks();
        }
    );
    return false;
}

// onClick function when the "X" delete comment button is pressed.
function deleteComment(context)
{
    // We take the id of the button which is equivalent to the mongoDB _id of the book it is related to as well as the _id of the comment.
    var commentId = context.id;
    //console.log(commentId);
    // We send an AJAX DELETE request to the backend with the combination of ids in the data field so we can easily access it via "req.body" on the backend.
    $.ajax({
        url: '/books',
        type: 'DELETE',
        data: {_id: commentId},
        // If the DELETE request is successful, we re-render all the books.
        success: function(res)
        {
            //console.log("deletion successful");
            renderBooks();
        }
    });
}

// Refactored code that was taken from the onReady function and put in a function so that it can be called in other places.
function renderBooks()
{
    var $booksCon = $("#booksCon");
    var bookHTML = $("#bookTemp").html();
    var bookTemp = _.template(bookHTML);

    // We get rid of all the previously created books so we don't have duplicates.
    $booksCon.empty();

    $.get("/books").
        done(function(data) {
            console.log(data);
            $(data).each(function (index, book) {
                var $book = $(bookTemp(book));
                $booksCon.append($book);
            });
    });
}

// wait for the document to be ready
$(function () {
    console.log("app.js is now running");

    renderBooks();
});

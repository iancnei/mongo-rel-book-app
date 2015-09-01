function sendComment(context)
{
    var id = context.id;
    var data = $("#" + id + "form").serialize();
    data += "&_id=" + id;
    console.log(data);
    id = "#" + context.id;
    $.post("/books", data)
    .done(
        function(response)
        {
            renderBooks();
            $(id + "form")[0].reset();
        }
    );
    return false;
}

function deleteComment(context)
{
    var commentId = context.id;
    //console.log(commentId);
    $.ajax({
        url: '/books',
        type: 'DELETE',
        data: {_id: commentId},
        success: function(res)
        {
            //console.log("deletion successful");
            renderBooks();
        }
    });
}

function renderBooks()
{
    var $booksCon = $("#booksCon");
    var bookHTML = $("#bookTemp").html();
    var bookTemp = _.template(bookHTML);

    $booksCon.empty();

    $.get("/books").
        done(function(data) {
            //console.log(data);
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

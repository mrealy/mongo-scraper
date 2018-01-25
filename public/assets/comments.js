$(document).ready(function() {
    // 
    $(".comment").on("click", function() {

        $("#comments").remove();
        $("#comment").empty();

        // pull button value (id) and store into variable
        var thisId = $(this).val();
        var currentButton = $(this);
        //console.log("thisId from comments.js jQuery file is ", thisId);

        $.ajax({
            method: "GET",
            url: "/comments/" + thisId
        }).done(function(data) {
            console.log("Article comments after GET: ", data.comments);
            
            // Generates the comment input UI for article            
            displayComments(data, currentButton);

        });
        
    });

    // $("#commentSubmit").on("click", function() {
    $(document).on("click", "#commentSubmit", function() {
        
        var thisId = $(this).attr("data-id");
        console.log("clicked on " + thisId);
        $.ajax({
            method: "POST",
            url: "/comments/" + thisId,
            data: {
                title: $("#comment-user").val(),
                body: $("#comment-body").val()
            }
        }).done(function(data) {
            console.log("articles comments after POST: ", data.comments);
            $("#comments").empty();
        });
        $("#comment-user").val("");
        $("#comment-body").val("");
    });

    function displayComments(data, currentButton) {
        console.log("in displayComments ", currentButton);
        var comments = data.comments;
        currentButton.after("<div id='comments'></div>");
        $("#comments").append("<div id='comments-input'></div>");
        $("#comments-input").append("<h4> Article comments </h4>");
        for (var i = 0; i <= comments.length; i++) {
            (function(i) {
                if (i < comments.length) {
                    
                    commentID = comments[i];
                    $.ajax({
                        method: "GET",
                        url: "/comment/" + commentID,
                    }).done(function(data) {
                        //console.log("Comment data in displayComments " + i + " is", data);
                        $("#comments").append("<div id='comment-container-"+i+"' class='comment-container'></div>");                                    
                        $("#comment-container-"+i).append("<p> Comment title is " + data.title + "</p>");
                        $("#comment-container-"+i).append("<p> Comment body is " + data.body + "</p>");                 
                    });
                }
                if (i === comments.length) {
                    renderCommentInput();
                }
            })(i);
        }
        function renderCommentInput() { 
            $("#comments-input").append("<div class='form-group'></div>")
            $(".form-group").append("<input id='comment-user' name='title' type='text' class='pull-right'>");            
            $(".form-group").append("<label for='comment-user' class='pull-right'>User:</label>");            
            $(".form-group").append("<label for='comment-body'>Comment:</label>");
            $(".form-group").append("<textarea id='comment-body' name='body' class='form-control' rows='2'></textarea>");
            $("#comments-input").append("<button class='btn-submit btn-sm btn-success' data-id='" + data._id + "' id='commentSubmit'>Save comment</button>");
        }
    }

});
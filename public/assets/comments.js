$(document).ready(function() {
    var thisId;
    $(".comment").on("click", function() {
            // var thisId;
            var commentId = $(this).val();
            if (thisId === commentId) {
                console.log("thisId is already equal to button value");
                $("#comments").remove();
                return thisId = null;
            } else {
                $("#comments").remove();
                // pull article ID from button and store into thisId
                thisId = $(this).val();
                // store button into currentButton
                var currentButton = $(this);
                // render comments div after button
                currentButton.after("<div id='comments'></div>");
                // $("#comments").slideToggle();
                GetFromDbById(thisId);
            }   
    });
    function GetFromDbById(thisId) {
        $.ajax({
            method: "GET",
            url: "/comments/" + thisId
        }).done(function(data) {                
            // Generates the comment input UI for article            
            renderCommentsFromDatabase(data);
            console.log("GetFromDbByID done");
        });
    }
    // $("#commentSubmit").on("click", function() {
    $(document).on("click", "#commentSubmit", function() {
        
        var thisId = $(this).attr("data-id");
        // console.log("clicked on " + thisId);
        // console.log("submit button ", $(this));
        $.ajax({
            method: "POST",
            url: "/comments/" + thisId,
            data: {
                title: $("#comment-user").val(),
                body: $("#comment-body").val()
            }
        }).done(function(data) {
            // console.log("articles comments after POST: ", data, data.comments);
            $("#comments").empty();
            GetFromDbById(data._id);
        });
        $("#comment-user").val("");
        $("#comment-body").val("");
    });

    function renderCommentsFromDatabase(data) {
        var comments = data.comments;
        $("#comments").append("<div id='comments-input'></div>");
        $("#comments-input").append("<h4> Article comments </h4>");
        $("#comments").append("<div class='comments-container'></div>");
        for (var i = comments.length - 1; i >= -1; i--) {
            (function(i) {
                if (i >= 0) {
                    commentID = comments[i];
                    $.ajax({
                        method: "GET",
                        url: "/comment/" + commentID,
                    }).done(function(data) {
                        //console.log("Comment data in displayComments " + i + " is", data);
                        $(".comments-container").append("<div id='comment-container-"+i+"' class='comment-container'></div>");                                    
                        $("#comment-container-"+i).append("<p class='user-text'> Posted by " + data.title + "</p>");
                        $("#comment-container-"+i).append("<p class='body-text'>" + data.body + "</p>");                 
                    });
                }
                if (i === -1) {
                    renderCommentInput();
                }
            })(i);
        }
        function renderCommentInput() {
            console.log("render has written");
            $("#comments-input").append("<div class='form-group'></div>");
            $(".form-group").append("<input id='comment-user' name='title' type='text' class='pull-right'>");            
            $(".form-group").append("<label for='comment-user' class='pull-right'>User:</label>");            
            $(".form-group").append("<label for='comment-body'>Comment:</label>");
            $(".form-group").append("<textarea id='comment-body' name='body' class='form-control' rows='2'></textarea>");
            $("#comments-input").append("<button class='btn-submit btn-sm btn-success' data-id='" + data._id + "' id='commentSubmit'>Save comment</button>");
        }
    }

});
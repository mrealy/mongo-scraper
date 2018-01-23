$(document).ready(function() {
    // 
    $(".comment").on("click", function() {

        $("#test").remove();
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
            displayComments(data.comments, currentButton);
            $("#test").append("<h4>" + data.title + "</h4>");
            $("#test").append("<input id='commentTitle' name='title'>");
            $("#test").append("<textarea id='commentBody' name='body'></textarea>");
            $("#test").append("<button class='btn-submit btn-sm' data-id='" + data._id + "' id='commentSubmit'>Save comment</button>");

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
                title: $("#commentTitle").val(),
                body: $("#commentBody").val()
            }
        }).done(function(data) {
            console.log("articles comments after POST: ", data.comments);
            $("#comments").empty();
        });
        $("#commentTitle").val("");
        $("#commentBody").val("");
    });

    function displayComments(comments, currentButton) {
        console.log("in displayComments ", currentButton);
        currentButton.after("<div id='test'></div>");
        for (var i = 0; i <= comments.length; i++) {
            commentID = comments[i];
            $.ajax({
                method: "GET",
                url: "/comment/" + commentID,
            }).done(function(data) {
                console.log("Comment data in displayComments " + i + " is", data);
                $("#test").append("<div id='comment-container-"+i+"' class='comment-container'></div>");
                $("#comment-container-"+i).append("<p> Comment title is " + data.title + "</p>");
                $("#comment-container-"+i).append("<p> Comment body is " + data.body + "</p>");              
            });
        } 
        // $.ajax({
        //     method: "GET",
        //     url: "/co"
        // })
    }

});
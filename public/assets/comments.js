$(document).ready(function() {

    // $("#comment").hide();
    var selId;

    $(".comment").on("click", function() {

        //$("#comment").css("visibility", "visible");
        $("#comment").empty();

        // pull button value (id) and store into variable
        var thisId = $(this).val();

        $.ajax({
            method: "GET",
            url: "/comments/" + thisId
        }).done(function(data) {
            console.log(data);
            
            $("#comment").append("<h4>" + data.title + "</h4>");
            $("#comment").append("<input id='commentTitle' name='title'>");
            $("#comment").append("<textarea id='commentBody' name='body'></textarea>");
            $("#comment").append("<button class='btn-submit btn-sm' data-id='" + data._id + "' id='commentSubmit'>Save comment</button>");
            
            if (data.comment) {
                $("#commentTitle").attr("placeholder", data.comment.title + " (current title)");
                $("#commentBody").attr("placeholder", data.comment.body + " (current comment)");
            }
        })
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
            console.log(data);
            $("#comments").empty();
        });
        $("#commentTitle").val("");
        $("#commentBody").val("");
    });

});
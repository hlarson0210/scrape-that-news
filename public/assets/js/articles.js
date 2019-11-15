// js file to...
// add || delete note
// save articles
// view saved articles



// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function () {
    $('.parallax').parallax();
    $('.sidenav').sidenav();

    $(".beer-me").on("click", (event) => {
        event.preventDefault();
        console.log("HEY");
        $.ajax({
            type: "GET",
            url: "/scrape"
        }).then(
            function (data) {
                location.reload();
            }).catch(function (err) {
                alert(err);
            });
    });

    $("#clear-articles").on("click", () => {
        $.ajax("/api/drop", {
            type: "GET",
            url: "/api/drop"
        }).then(
            function () {
                location.reload();
            }
        );
    });

    $(".favNow").on("click", function (event) {
        event.preventDefault();
        const articleId = $(this).parents(".collection").attr("data-_id");
        console.log(articleId)
        $.ajax({
            method: "PUT",
            url: "/api/articles/" + articleId
        }).then(function (data) {
            console.log(data);
            location.reload();
        }).catch(function (err) {
            alert(err);
        });
    })

});
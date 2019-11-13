// js file to...
// scrape
// add || delete note
// save articles
// view saved articles



// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function() {
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


    // $("#clear-articles").on("click", () => {
    //     let data;

    //     $.ajax("/api/drop", {
    //         type: "POST",
    //         data: data
    //     }).then(
    //         function () {
    //             location.reload();
    //         }
    //     );
    // });
});
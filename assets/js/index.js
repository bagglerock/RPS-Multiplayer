$("#open-login-button").on("click", function () {
    $("#login-modal").show();
})

$("#open-signup-button").on("click", function () {
    $("#signup-modal").show();
})

//  Event listener: click to close(hide) the modal
$("#filters-close").on("click", function () {
    $(".modal").hide();
    showFilters();
})

//  Event listener:  click to close a general modal when clicked outside of the modal
$(document).on("click", function (event) {
    var modalClass = document.getElementsByClassName("modal");
    for (var i = 0; i < modalClass.length; i++) {
        if (event.target == modalClass[i]) {
            $(".modal").hide();
        }
    }
});

//  Event listener:  click to close modal when cancel is clicked
$(".cancel").on("click", function () {
    $(".modal").hide();
})
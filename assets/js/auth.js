//  Regular Login - if user has signed up
$("#login-button").on("click", function (event) {
    event.preventDefault();
    var email = $("#login-email")
        .val()
        .trim();
    var pass = $("#login-pass")
        .val()
        .trim();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => $("#message").text(e));
    $("#login-email").val("");
    $("#login-pass").val("");
    $("#login-modal").hide();
});

//  Signup - takes in name, email and password
$("#signup-button").on("click", function () {
    event.preventDefault();
    var name = $("#name-input")
        .val()
        .trim();
    var email = $("#email-input")
        .val()
        .trim();
    var pass = $("#pass-input")
        .val()
        .trim();
    const promise = auth
        .createUserWithEmailAndPassword(email, pass)
        .then(function (user) {
            console.log(user);
            user.updateProfile({
                displayName: name
            });
        });
    //  return an error in case and show it under messages
    promise.catch(e => $("#message").text(e));
    $("#name-input").val("");
    $("#email-input").val("");
    $("#pass-input").val("");
    $("#signup-modal").hide();
});

$("#logout-button").on("click", function () {
    event.preventDefault();
    auth.signOut();
});

//  On auth changes - DOM manipulation - When a user signs on or signs off
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        $("#message").text(firebaseUser.displayName + " is currently signed in.");
        $("#logout-button").show();
        $("#open-login-button").hide();
        $("#open-signup-button").hide();
        $(".games-list-wrapper").show();
        $("#player-1-form").hide();
        $("#player-2-form").hide();
        showGames();
    } else {
        $("#message").text("No one is signed in at the moment.");
        $("#logout-button").hide();
        $("#open-login-button").show();
        $("#open-signup-button").show();
        $(".games-list-wrapper").hide();
        $("#player-1-form").hide();
        $("#player-2-form").hide();
    }
});
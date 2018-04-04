//  On auth changes - DOM manipulation
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      $("#message").text(firebaseUser.email + " is currently signed in.");
      $("#logout-button").removeClass("hide");
      $("#login-button").addClass("hide");
      $("#signup-modal").addClass("hide");
      $("#login-email").addClass("hide");
      $("#login-pass").addClass("hide");
      $(".signup-modal").hide();
      $("#chat-message").removeClass("hide");
      $("#submit-chat").removeClass("hide");
      $("#available-games-area").removeClass("hide");
      $("#create-game-area").removeClass("hide");
    } else {
      $("#message").text("No one is signed in at the moment.");
      $("#logout-button").addClass("hide");
      $("#login-button").removeClass("hide");
      $("#signup-modal").removeClass("hide");
      $("#login-email").removeClass("hide");
      $("#login-pass").removeClass("hide");
      $("#chat-message").addClass("hide");
      $("#submit-chat").addClass("hide");
      $("#available-games-area").addClass("hide");
      $("#create-game-area").addClass("hide");
      $("#creator-choices").addClass("hide");
      $("#joiner-choice").addClass("hide");
    }
  });


//  Regular Login - if user has signed up
$("#login-button").on("click", function() {
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
});

//  Signup - takes in name, email and password
$("#signup-button").on("click", function() {
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
    .then(function(user) {
      user.updateProfile({ displayName: name });
    });
  //  return an error in case and show it under messages
  promise.catch(e => $("#message").text(e));
  $("#name-input").val("");
  $("#email-input").val("");
  $("#pass-input").val("");
});

//  Show modal if sign-up is clicked
$("#signup-modal").on("click", function() {
  $(".signup-modal").show();
});

//   Event listener to close signin modal if x is clicked
$(".close").on("click", function() {
  $(".signup-modal").hide();
});

//  Event listener to close signin modal if the modal is clicked in the gray area
$(document).on("click", function(event) {
  // not sure why the jquery reference to this would not work but whatever, i should use js instead
  var signupModal = document.getElementById("signup");
  if (event.target == signupModal) {
    $(".signup-modal").hide();
  }
});

$("#logout-button").on("click", function() {
  event.preventDefault();
  auth.signOut();
});

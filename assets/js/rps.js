//**  Initialization **/

var config = {
  apiKey: "AIzaSyBPiD9vqhR_OvZkLeujNOA-Ev7DnehcmrY",
  authDomain: "rps-multiplayer-f09f3.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-f09f3.firebaseio.com",
  projectId: "rps-multiplayer-f09f3",
  storageBucket: "rps-multiplayer-f09f3.appspot.com",
  messagingSenderId: "1014005356723"
};
firebase.initializeApp(config);

//*  End of Initialization */

//*  Variables */

//set some variables, one for database and another for auth
var database = firebase.database();
var auth = firebase.auth();

//have an array for the game states to be saved for a game
var gameState = {
  closed: 0,
  open: 1,
  joined: 2,
  p1chose: 3,
  p2chose: 4,
  result: 5
};

//*  End of Variables */

//* Auth Change */

//  Anytime the user has logged in, logged out, this shows and hides things on the DOM
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
    /*
      
      
      */
  }
});

//game stuff

//if this user becomes a joiner, set the game with a joiner of a uid and the game state will be joined (2) ----- authstatechange

//if there arent any open games, then create game
// this player becomes the creator of the game and the game state will be open (1) ----authstatechange

// if the game state is at joined(2) then it is player one's turn so wait for choice.   once choice is selected the the game state is p1chose(3)  -----gamestatechange

// if the game state is at p1chose(3) then its player two's turn so wait for choice.  once choice is selected the game state is p2chose(4)-----gamestatechange

//if the game state is at p2chose(4) then compare choices and send result back to the DOM.  gamestate is result(5)-----gamestatechange

//if gamestate is result(5), after result is shown gamestate is now joined(2)-----gamestatechange

//if gamestate is open(1) wait for player----- authstatechange

//if gamestate is close(0), remove the game from the games list----- authstatechange

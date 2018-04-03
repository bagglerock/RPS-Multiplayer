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

//*  Variables */

//set some variables, one for database and another for auth
var database = firebase.database();
var ref = firebase.database().ref("/games");
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

function watchGame(key) {
  var gameRef = ref.child(key);
  gameRef.on("value", function(snapshot) {
    var game = snapshot.val();
    switch (game.state) {
      
      case gameState.open:
        if (auth.currentUser.uid === game.creator.uid) {
          $("#available-games-area").addClass("hide");
          $("#create-game-area").addClass("hide");
          $("#message").text(game.creator.displayName + " has just created a game.")
        }
        break;

      case gameState.joined:
        if (auth.currentUser.uid === game.creator.uid) {
          console.log("you are the creator and its your turn");
          $("#creator-choices").removeClass("hide");
          $("#available-games-area").addClass("hide");
          $("#create-game-area").addClass("hide");
          $("#creator-choice").attr("game-id", key);
        } else if (auth.currentUser.uid === game.joiner.uid) {
          $("#message").text("You have joined " + game.creator.displayName + ".  Please wait till they make a choice.");
          $("#create-game-area").addClass("hide");
          $("#available-games-area").addClass("hide");
        }
        break;

      case gameState.p1chose:
        if (auth.currentUser.uid === game.joiner.uid) {
          $("#message").text(game.creator.displayName + " has just went so it's your turn.")
          $("#joiner-choices").removeClass("hide");
          $("#joiner-choice").attr("game-id", key);
        } else if (auth.currentUser.uid === game.creator.uid) {
          $("#creator-choices").addClass("hide");
          $("#message").text("Nice move, now wait for the next player to choose.")
        }
        break;

      case gameState.p2chose:
        console.log("compareChoices");
        break;

      case gameState.result:
        console.log("result");
        showResult();
        break;
    }
  });
}

database.ref("/games").on("child_added", function(snapshot) {
  var currentGame = snapshot.key;
  watchGame(currentGame);
});

database.ref("/games").on("child_changed", function(snapshot) {
  var currentGame = snapshot.key;
  watchGame(currentGame);
});

$("#creator-choice").on("click", function() {
  var choice = $("input[name=rps]:checked").val();
  var gameId = $(this).attr("game-id");
  var ref = database.ref("/games/" + gameId);
  ref.child("state").set(gameState.p1chose);
  ref.child("/creator/choice").set(choice);
});

$("#joiner-choice").on("click", function() {
  var choice = $("input[name=rps]:checked").val();
  var gameId = $(this).attr("game-id");
  var ref = database.ref("/games/" + gameId);
  ref.child("state").set(gameState.p2chose);
  ref.child("/joiner/choice").set(choice);
});

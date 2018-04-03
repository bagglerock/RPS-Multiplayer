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

var globalKey = "";

function watchGame(key) {
  console.log("here");
  var gameRef = database.ref("/games").child(key);
  console.log(gameRef);
  gameRef.on("value", function(snapshot) {
    var game = snapshot.val();
    switch (game.state) {
      case gameState.joined:
      console.log("hi");
      game.state = gameState.result;
        displayChoices("creator-options");
        break;
      case gameState.p1chose:
        displayChoices("joiner-options");
        break;
      case gameState.p2chose:
      compareChoices();
        break;
      case gameState.result:
      console.log("result");
        showResult();
        break;
    }
  });
}


function displayChoices(who){//  change this to show
  var br1 = $("<br>");
  var br2 = $("<br>");
  var radioForm = $("<form>");
  var radioInputRock = $("<input>");
  var rockLabel = $("<label>");
  var radioInputPaper = $("<input>");
  var paperLabel = $("<label>");
  var radioInputScissors = $("<input>");
  var scissorsLabel = $("<label>");
  radioInputRock.attr("type", "radio").attr("name", "rps").attr("value", "rock");
  rockLabel.text("Rock");
  radioInputPaper.attr("type", "radio").attr("name", "rps").attr("value", "paper");
  paperLabel.text("Paper");
  radioInputScissors.attr("type", "radio").attr("name", "rps").attr("value", "scissors");
  scissorsLabel.text("Scissors");
  radioForm.append(radioInputRock, rockLabel, br1, radioInputPaper, paperLabel, br2, radioInputScissors, scissorsLabel);
  $("#"+who).append(radioForm);

}

database.ref("/games/"+globalKey).on("value", function(){
  console.log("something");
  watchGame(globalKey);
});

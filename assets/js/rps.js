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
      case gameState.joined:
      $("#creator-choices").removeClass("hide");
      $("#available-games-area").addClass("hide");
      $("#create-game-area").addClass("hide");
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

}

database.ref("/games").on("child_changed", function(snapshot){
  var currentGame = snapshot.key;
  watchGame(currentGame);
});

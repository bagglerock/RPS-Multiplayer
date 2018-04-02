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

//*  Functions */

$()

function createGame() {
  var user = auth.currentUser;
  var currentGame = {
    creator: {
      uid: user.uid,
      displayName: user.displayName
    },
    state: gameState.open
  };
  var test = database
    .ref("/games")
    .push()
    .set(currentGame);
    console.log(test);
}

$("#create-game").on("click", function(){
  createGame();
})



//* End of Functions */

//*  User Signup and Login */

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

//*  End of User Signup and Login */

//*  Section to join open games */

//  Variable for games that are open
var openGames = database
  .ref("/games")
  .orderByChild("state")
  .equalTo(gameState.open);

//  When a new game is added, update the open games list
openGames.on("child_added", function(snapshot) {
  var data = snapshot.val();
  //  only show the games that are not created by this user
  if (data.creator.uid === auth.currentUser.uid) {
    addJoinGameButton(snapshot.key, data);
  }
});

openGames.on("child_removed", function(snapshot){
  var game = $("[key="+snapshot.key+"]");
  console.log(game);
  if (game){
    game.remove();
  }
})

function addJoinGameButton(key, data) {
  var gameInfoDiv = $("<div>");
  var gameCreatorHeader = $("<h4>");
  var joinButtonDiv = $("<div>");
  var joinButton = $("<button>");

  joinButton
  .text("Join " + data.creator.displayName)
  .addClass("button")
  .attr("key", key)
  .attr("id", "join-button");

  joinButtonDiv.append(joinButton);
  $("#games").append(joinButtonDiv);
}

function joinGame(key) {
  var user = auth.currentUser;
  var gameRef = database.ref("/games").child(key);
  gameRef.transaction(function(game) {
    if (!game.joiner) {
      game.state = gameState.joined;
      game.joiner = {
        uid: user.uid,
        displayName: user.displayName
      };
    }
    console.log("joiner has joined");

    return game;
  });
}

$(document).on("click", "#join-button", function(){
  var key = $(this).attr("key");
  joinGame(key);
})


//*  End of Section to join open games */

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


    /*if(gameState === 0){
        createGame(); //makes this user the creator
        gameState = 1; //Open
      }
      else if (gameState === 1){
        setPlayer2();
        gameState = 2; //Joined
      }
      */
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

var testGame = database.ref("/games/key");
console.log(testGame);

//game stuff

//if this user becomes a joiner, set the game with a joiner of a uid and the game state will be joined (2) ----- authstatechange

//if there arent any open games, then create game
// this player becomes the creator of the game and the game state will be open (1) ----authstatechange

// if the game state is at joined(2) then it is player one's turn so wait for choice.   once choice is selected the the game state is p1chose(3)  -----gamestatechange

// if the game state is at p1chose(3) then its player two's turn so wait for choice.  once choice is selected the game state is p2chose(4)-----gamestatechange

//if the game state is at p2chose(4) then compare choices and send result back to the DOM.  gamestate is result(5)-----gamestatechange

//if gamestate is result(5), after result is shown gamestate is now joined(2)-----gamestatechange

//*  Log out */

$("#logout-button").on("click", function() {
  event.preventDefault();
  auth.signOut();
});

//* End of Log out */

//if gamestate is open(1) wait for player----- authstatechange

//if gamestate is close(0), remove the game from the games list----- authstatechange

//chat stuff
//*  Chat Logic */

//  When submit-chat button is pressed, the chat is updated in firebase
$("#submit-chat").on("click", function() {
  event.preventDefault();
  var message = $("#chat-message").val();
  var currentUserName = auth.currentUser.displayName;
  database
    .ref("/chat")
    .push()
    .set({
      name: currentUserName,
      message: message
    });
  $("#chat-message").val("");
});

//  When the return button is pressed, the submit-chat button is pressed to send the chat to firebase
$("#chat-message").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#submit-chat").click();
  }
});

//  show the chat content;
database.ref("/chat").on("child_added", function(snapshot) {
  var message = snapshot.val();
  if (message.name !== undefined) {
    var pTag = $("<p>");
    pTag.text(message.name + ": " + message.message);
    $("#chat-messages").append(pTag);
    //  neat little piece of code that autoscrolls to the bottom of the text area
    var textarea = $("#chat-messages");
    if (textarea.length) {
      textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
    }
  }
});

//*  End of Chat Logic */

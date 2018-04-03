function createGame() {
  var user = auth.currentUser;
  var currentGame = {
    creator: {
      uid: user.uid,
      displayName: user.displayName
    },
    state: gameState.open
  };
  database
    .ref("/games")
    .push()
    .set(currentGame);

    console.log(globalKey);
}

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
    
    return game;
  });
}

var openGames = database
  .ref("/games")
  .orderByChild("state")
  .equalTo(gameState.open);

//  When a new game is added, update the open games list
openGames.on("child_added", function(snapshot) {
  var data = snapshot.val();
  //  only show the games that are not created by this user
  if (data.creator.uid != auth.currentUser.uid) {
    addJoinGameButton(snapshot.key, data);
  }
});

openGames.on("child_removed", function(snapshot) {
  var game = $("[key=" + snapshot.key + "]");
  if (game) {
    game.remove();
  }
});

$("#create-game").on("click", function() {
  createGame();
});

$(document).on("click", "#join-button", function() {
  var key = $(this).attr("key");
  var game = joinGame(key);
  globalKey = key;
  console.log(globalKey);
});

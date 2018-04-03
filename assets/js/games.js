var openGames = database
  .ref("/games")
  .orderByChild("state")
  .equalTo(gameState.open);


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




  $("#create-game").on("click", function() {
    createGame();
  });
function playGame(key) {

    var gameRef = ref.child(key);

    gameRef.on("value", function(snapshot) {
      var game = snapshot.val();
      switch (game.state) {
        case gameState.open:
          if (auth.currentUser.uid === game.creator.uid) {
            $("#open-login-button").hide();
            $("#open-signup-button").hide();
            $(".games-list-wrapper").hide();
            $(".create").hide();
            $("#player-1-form").hide();
            $("#player-2-form").hide();
            $("#message").text(
              game.creator.displayName + " has just created a game."
            );
          }
          break;
  
        case gameState.joined:
          if (auth.currentUser.uid === game.creator.uid) {
            $("#message").text("You are the creator and its your turn");
            $("#player-1-form").show();
            $("#player-2-form").hide();
            $(".create").hide();
            $("#creator-choice").attr("game-id", key);
          } else if (auth.currentUser.uid === game.joiner.uid) {
            $("#message").text(
              "You are now in the game with " +
                game.creator.displayName +
                ".  Please wait till " + game.creator.displayName + " makes a choice."
            );
            $("#player-1-form").hide();
            $("#player-2-form").hide();
            $(".create").hide();
          }
          break;
  
        case gameState.p1chose:
          if (auth.currentUser.uid === game.joiner.uid) {
            $("#message").text(
              game.creator.displayName + " has just went so it's your turn."
            );
            $("#player-2-form").show();
            $("#player-1-form").hide();
            $("#joiner-choice").attr("game-id", key);
          } else if (auth.currentUser.uid === game.creator.uid) {
            $("#player-1-form").hide();
            $("#player-2-form").hide();
            $("#message").text(
              "Nice move, now wait for the next player to choose."
            );
          }
          break;
  
        case gameState.p2chose:
          $("#message").text("");
          var result = "";
          var creatorChoice = game.creator.choice;
          var joinerChoice = game.joiner.choice;
          if (creatorChoice === joinerChoice) {
            result = "tie";
          } else if (creatorChoice === "rock") {
            if (joinerChoice === "scissors") {
              result = game.creator.displayName + " wins";
            } else {
              result = game.joiner.displayName + " wins";
            }
          } else if (creatorChoice === "paper") {
            if (joinerChoice === "rock") {
              result = game.creator.displayName + " wins";
            } else {
              result = game.joiner.displayName + " wins";
            }
          } else if (creatorChoice === "scissors") {
            if (joinerChoice === "paper") {
              result = game.creator.displayName + " wins";
            } else {
              result = game.joiner.displayName + " wins";
            }
          }
          $("#message").text(result);
          //$("#game-result").text("build a whole DOM element here with stats.");
          console.log(result);
          //gameRef.child("state").set(gameState.result);
          break;
  
        case gameState.result:
        //   setTimeout(function(){
        //     gameRef.child("state").set(gameState.joined);
        //   }, console.log(result));
          break;
      }
    });
  }

  // this is being hit 3x with once and 5 or 6 with on
  // database.ref("/games").on("child_added", function(snapshot) {
  //   var currentGame = snapshot.key;
  //   playGame(currentGame);
  // });
  
  // this is being hit 3x with once and 5 or 6 with on
  // database.ref("/games").on("child_changed", function(snapshot) {
  //   var currentGame = snapshot.key;
  //   console.log("changed");
  //   console.log(snapshot.val())
  //   //playGame(currentGame);
  // });
  
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
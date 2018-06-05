// Variables 

var openGames = database
    .ref("/games")
    .orderByChild("state")
    .equalTo(gameState.open);

// Functions

function showGames() {
    openGames.on("value", function(snapshot){
        var data = snapshot.val();
        // for (var key in data){
        // }
        $("#games").empty();

        if(data !== null){
            Object.keys(data).forEach(function(key) {
                if (data[key].creator.uid !== auth.currentUser.uid) {
                    addJoinGameButton(key, data[key]);
                }
              });
        }
    });
}

function addJoinGameButton(key, data) {
    var joinButton = $("<button>");

    joinButton
        .text("Join " + data.creator.displayName)
        .addClass("button")
        .attr("key", key)
        .attr("id", "join-button");

    $("#games").append(joinButton);
}

function createGame() {
    var user = auth.currentUser;
    var newGame = {
        creator: {
            uid: user.uid,
            displayName: user.displayName
        },
        state: gameState.open
    };
    var newKey = database.ref().child("/games").push().key;
    var updates = {};
    updates['/games/' + newKey] = newGame;
    firebase.database().ref().update(updates);
    playGame(newKey);
}

function joinGame(key) {
    console.log(key);
    var user = auth.currentUser;
    var gameRef = ref.child(key);
    gameRef.transaction(function (game) {
        console.log(game);
        if (!game.joiner) {
            game.state = gameState.joined;
            game.joiner = {
                uid: user.uid,
                displayName: user.displayName
            };
        }
        return game;
    });
    playGame(key);
}

//  When a new game is added, update the open games list
openGames.on("child_added", function (snapshot) {
    var data = snapshot.val();
    //  only show the games that are not created by this user
    if (data.creator.uid !== auth.currentUser.uid) {
        addJoinGameButton(snapshot.key, data);
    }
});

openGames.on("child_removed", function (snapshot) {
    var game = $("[key=" + snapshot.key + "]");
    if (game) {
        game.remove();
    }
});

$("#create-game").on("click", function () {
    createGame();
});

$(document).on("click", "#join-button", function () {
    var key = $(this).attr("key");
    var game = joinGame(key);
});
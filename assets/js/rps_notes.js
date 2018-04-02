  // Initialize Firebase ---------
  var config = {
    apiKey: "AIzaSyBPiD9vqhR_OvZkLeujNOA-Ev7DnehcmrY",
    authDomain: "rps-multiplayer-f09f3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f09f3.firebaseio.com",
    projectId: "rps-multiplayer-f09f3",
    storageBucket: "rps-multiplayer-f09f3.appspot.com",
    messagingSenderId: "1014005356723"
  };
  firebase.initializeApp(config);
  // End of Initialization ---------

  
  //  Make a constant for the firebase database
  const database = firebase.database();

  //  Make a constant for the auth
  const auth = firebase.auth();

  var gameState = {
    closed: 0,
    open: 1,
    joined: 2,
    p1choose: 3,
    p2choose: 4,
    result: 5

  }


  //  This event listener will take the email and password typed and sign in with them.  Returns an error of the user is not found
  $("#login-button").on("click", function(){
    event.preventDefault();
    var email = $("#login-email").val().trim();
    var pass = $("#login-pass").val().trim();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => $("#message").text(e));
    $("#login-email").val("");
    $("#login-pass").val("");
  })
  

  //  This event listener will take the email and password typed and create a new user along with a display name
  $("#signup-button").on("click", function(){
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var email = $("#email-input").val().trim();
    var pass = $("#pass-input").val().trim();
    const promise = auth.createUserWithEmailAndPassword(email, pass).then(function(user){
      user.updateProfile({displayName: name});
    });
    //  return an error in case and show it under messages
    promise.catch(e => $("#message").text(e));
    $("#name-input").val("");
    $("#email-input").val("");
    $("#pass-input").val("");
  })


  //  This event listener will log out the current user
  $("#logout-button").on("click", function(){
    event.preventDefault();
    auth.signOut();
  })


  //  Anytime the user has logged in, logged out, this shows and hides things on the DOM
  auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      $("#message").text(firebaseUser.email + " is currently signed in.")
      $("#logout-button").removeClass("hide");
      $("#login-button").addClass("hide");
      $("#signup-modal").addClass("hide");
      $("#login-email").addClass("hide");
      $("#login-pass").addClass("hide");
      $(".signup-modal").hide();
      $("#chat-message").removeClass("hide");
      $("#submit-chat").removeClass("hide");
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
      $("#message").text("No one is signed in at the moment.")
      $("#logout-button").addClass("hide");
      $("#login-button").removeClass("hide");
      $("#signup-modal").removeClass("hide");
      $("#login-email").removeClass("hide");
      $("#login-pass").removeClass("hide");
      $("#chat-message").addClass("hide");
      $("#submit-chat").addClass("hide");
      /*
      
      
      */ 
    }
  })

  //  this show the open games available
  var openGames = database.ref("/games").orderByChild("state").equalTo(gameState.open);
  openGames.on("child_added", function(snapshot){
    var data = snapshot.val();
    //  only show the games that are not created by this user
    if (data.creator.uid !== auth.currentUser.uid){
      addJoinGameButton(snapshot.key, data);
    }
  })

  openGames.on("child_removed", function(snapshot){
    console.log(snapshot);
    //remove the button for the game;
  })

  function createGame() {
    var user = auth.currentUser;
    var currentGame = {
      creator : {
        uid : user.uid,
        displayName: user.displayName
      },
      state : gameState.open
    }
    database.ref("/games").push().set(currentGame);
  }

  function addJoinGameButton(key, data) {
    var gameInfoDiv = $("<div>");
    var gameCreatorHeader = $("<h4>");
    gameCreatorHeader.text(data.creator.displayName);
    gameInfoDiv.append(gameCreatorHeader);
    $("#games").append(gameInfoDiv);
    var joinButtonDiv = $("<div>");
    var joinButton = $("<button>");
    joinButton.text("Join Game").attr("key", key);
    joinButtonDiv.append(joinButton);
    $("#games").append(joinButtonDiv);


  }

  function joinGame(key){
    var user = auth.currentUser;
    var gameRef = database.ref("/games").child(key);
    gameRef.transaction(function(game){
      if(!game.joiner){
        game.state = gameState.joined;
        game.joiner = {
          uid : user.uid,
          displayName : user.displayName
        }
      }
      return game;
    })
  }


  //  add to chat some message
  $("#submit-chat").on("click", function(){
    event.preventDefault();
    var message = $("#chat-message").val();
    var currentUserName = auth.currentUser.displayName;
    database.ref("/chat").push().set({
      name: currentUserName,
      message: message
    })
    $("#chat-message").val("");
  })

  //  show the chat content;
  database.ref("/chat").on("child_added", function(snapshot){
    var message = snapshot.val();
    if (message.name !== undefined){
      var pTag = $("<p>");
      pTag.text(message.name + ": " + message.message);
      $("#chat-messages").append(pTag);
      //  neat little piece of code that autoscrolls to the bottom of the text area
      var textarea = $("#chat-messages");
      if(textarea.length){
        textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
      }

    }

  })

  //  piece of code so hitting enter in the chat area will click submit the message
  $("#chat-message").keyup(function(event){
    if(event.keyCode === 13){
      $("#submit-chat").click();
    }
  })

  //  Show modal if sign-up is clicked
  $("#signup-modal").on("click", function(){
    $(".signup-modal").show();
  })

  //   Event listener to close signin modal if x is clicked
  $(".close").on("click", function(){
    $(".signup-modal").hide();
  })

  //  Event listener to close signin modal if the modal is clicked in the gray area
  $(document).on("click", function(event){
    // not sure why the jquery reference to this would not work but whatever, i should use js instead
    var signupModal = document.getElementById("signup");
    if (event.target == signupModal){
      $(".signup-modal").hide();
    }
    
  })

/*
  auth.createUserWithEmailAndPassword(email, pass); //returns promise but only once

  auth.onAuthStateChanged(firebaseUser => {}); //monitors user real time

*/
  /*
 notes:

 there will be player objects:
- players will have wins/losses/name/choice
player will input name and then the object is made:
wins/losses = 0 - to start - can change it to whatever information is stored in the firebase db
var wins = winsRecord;
var losses = lossesRecord;
var name = name
var choice;

there will be a turn indicator
var turn = 0;
if (turn === 0){ the players haven't finished inputting the name}
if (player1 && player2){ turn=1;}
-1 - player 1
-2 - player 2
-3 - the result
whoever has a turn, the div will changed the border color to show whos turn it is
when the result is displayed there is a timer that displays the result for a certain number of seconds
when the game starts over then the game restarts and the turn is on 1


Things to fix:

check if user is logged in before signing on... making an error
  */
  
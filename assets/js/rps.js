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


  //  This event listener will take the email and password typed and sign in with them.  Returns an error of the user is not found
  $("#login-button").on("click", function(){
    event.preventDefault();
    var email = $("#login-email").val().trim();
    var pass = $("#login-pass").val().trim();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => $("#message").text(e));
    $("#name-input").val("");
    $("#email-input").val("");
    $("#pass-input").val("");
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


  //  Anytime the user has logged in, logged out, this will do a bunch of things
  auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      $("#logout-button").removeClass("hide");
      $("#login-button").addClass("hide");
      $("#signup-button").addClass("hide");
      $("#name-input").addClass("hide");
      $("#email-input").addClass("hide");
      $("#pass-input").addClass("hide");
      $("#message").text(firebaseUser.email + " is currently signed in.")
      $(".signup-modal").hide();
    } else {
      $("#logout-button").addClass("hide");
      $("#login-button").removeClass("hide");
      $("#signup-button").removeClass("hide");
      $("#name-input").removeClass("hide");
      $("#email-input").removeClass("hide");
      $("#pass-input").removeClass("hide");
      $("#message").text("No one is signed in at the moment.")
    }
  })


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

  $("#signup-modal").on("click", function(){
    $(".signup-modal").show();
  })

  $(".close").on("click", function(){
    $(".signup-modal").hide();
  })

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



  */
  
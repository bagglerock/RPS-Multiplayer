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

  $("#login-button").on("click", function(){
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var pass = $("#pass-input").val().trim();
    const promise = auth.signInWithEmailAndPassword(name, pass);
    promise.catch(e => console.log(e.message));
    $("#name-input").val("");
    $("#pass-input").val("");
  })
  
  $("#signup-button").on("click", function(){
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var pass = $("#pass-input").val().trim();
    const promise = auth.createUserWithEmailAndPassword(name, pass);
    promise.catch(e => console.log(e.message));
    $("#name-input").val("");
    $("#pass-input").val("");
  })

  $("#logout-button").on("click", function(){
    auth.signOut();
  })

  auth.onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log(firebaseUser);
      $("#logout-button").removeClass("hide");
      $("#login-button").addClass("hide");
      $("#signup-button").addClass("hide");
      $("#name-input").addClass("hide");
      $("#pass-input").addClass("hide");
    } else {
      console.log("not logged in");
      $("#logout-button").addClass("hide");
      $("#login-button").removeClass("hide");
      $("#signup-button").removeClass("hide");
      $("#name-input").removeClass("hide");
      $("#pass-input").removeClass("hide");
    }
  })
  /*auth.signInWithEmailAndPassword(email, pass); // returns promise but only once

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
  
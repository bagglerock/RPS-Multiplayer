  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBPiD9vqhR_OvZkLeujNOA-Ev7DnehcmrY",
    authDomain: "rps-multiplayer-f09f3.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f09f3.firebaseio.com",
    projectId: "rps-multiplayer-f09f3",
    storageBucket: "rps-multiplayer-f09f3.appspot.com",
    messagingSenderId: "1014005356723"
  };
  firebase.initializeApp(config);
  
  //  Make a variable for the firebase database
  var database = firebase.database();
  

  //  Click event listener for submitting a player name
  $("#click-button").on("click", function() {
      //  Prevent the page from reloading
      event.preventDefault();
      //  Get the input from the name-input field, trim the whitespace
      var nameInput = $("#name-input");
      var name = nameInput.val().trim();
      //  Set name in the database to this name
      database.ref().set({
          name: name
      })
      //  Clear the form
      nameInput.val("");

  })
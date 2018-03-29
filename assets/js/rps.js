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

  //variable for the auth portion of firebase
  const auth = firebase.auth();
  
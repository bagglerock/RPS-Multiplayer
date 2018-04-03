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

function submitMessage(message){
    if (auth.currentUser !== null) {
        var currentUserName = auth.currentUser.displayName;
        database
            .ref("/chat")
            .push()
            .set({
                name: currentUserName,
                message: message
            });
        $("#submit-chat-message").val("");
    }
}

$("#submit-chat-button").on("click", function () {
    event.preventDefault();
    var message = $("#submit-chat-message").val();
    submitMessage(message);
});

//  When the return button is pressed, the submit-chat button is pressed to send the chat to firebase
$("#submit-chat-message").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#submit-chat-button").click();
    }
});

//  show the chat content;
database.ref("/chat").on("child_added", function (snapshot) {
    var message = snapshot.val();
    if (message.name !== undefined) {

        var pTag = $("<p>");
        pTag.html("<b>" + message.name + ": </b>" + message.message);
        $(".chat-log").append(pTag);
        //  neat little piece of code that autoscrolls to the bottom of the text area
        var textarea = $(".chat-log");
        if (textarea.length) {
            textarea.scrollTop(textarea[0].scrollHeight - textarea.height());
        }
    }
});
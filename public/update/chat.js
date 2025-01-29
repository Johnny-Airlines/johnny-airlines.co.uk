//const username = prompt("");

let pressedKeys = [];
var admin = false;

function bothKeysPressed() {
    if (pressedKeys.includes('Enter') && pressedKeys.includes('Control') && pressedKeys.includes('Alt')) {
      admin = true;
    }
}

document.addEventListener('keydown', () => {
   pressedKeys.push(event.key)
   bothKeysPressed();
})

document.addEventListener('keyup', () => {
   pressedKeys = pressedKeys.filter(key => key !== event.key)
})

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec + ' ' + date + ' ' + month + ' ' + year;
    return time;
}

function sendMessage() {
    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    document.getElementById("messages").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    // create db collection and send in the data
    db.ref("uMessages/" + timestamp).set({
        username:myPlayer.username,
        message,
        timestamp,
    });
}

const button = document.getElementById('message-btn');
button.addEventListener("click", () => {
    if (document.getElementById("message-input").value != "") {
        sendMessage();
    }
});

const fetchChat = db.ref("uMessages/");

fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
	//const message = `<li class=${myPlayer.username === messages.username ? "sent" : "receive"}><span>${timeConverter(messages.timestamp)} ${messages.username}: </span>${messages.message}</li>`;
	const message = document.createElement("li");
	message.setAttribute("class",`${myPlayer.username === messages.username ? "sent" : "receive"}`);
	const messageSpan = document.createElement("span")
	messageSpan.textContent = `${timeConverter(messages.timestamp)} ${messages.username}: `
	message.appendChild(messageSpan)
	message.appendChild(document.createTextNode(`${messages.message}`))
	// append the message on the page
	document.getElementById("messages").appendChild(message);
});


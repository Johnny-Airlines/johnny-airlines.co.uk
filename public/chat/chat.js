const db = firebase.database();

//const username = prompt("What is your username? (This is completely anonymous!)");
//const username = "TESTING"
const username = prompt("");

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
    db.ref("messages/" + timestamp).set({
        username,
        message,
        timestamp,
        admin
    });
}

const button = document.getElementById('message-btn');
button.addEventListener("click", () => {
    sendMessage();
});

const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    if (messages.admin == false) 
    {
        const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${timeConverter(messages.timestamp)} ${messages.username}: </span>${messages.message}</li>`;
        // append the message on the page
        document.getElementById("messages").innerHTML += message;
    }
    else {
        const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${timeConverter(messages.timestamp)} ${messages.username}: </span>${messages.message}</li>`;
        // append the message on the page
        document.getElementById("messages").innerHTML += message;
    }
});


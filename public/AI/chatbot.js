const firebaseConfig = {
  apiKey: "AIzaSyDJlncorTA9lATy5t-1bH0OH-lK509ipFw",
  authDomain: "johnnyairlinescouk.firebaseapp.com",
  databaseURL: "https://johnnyairlinescouk-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "johnnyairlinescouk",
  storageBucket: "johnnyairlinescouk.firebasestorage.app",
  messagingSenderId: "682303797708",
  appId: "1:682303797708:web:9d33dce60f9c16c8fe0569",
  measurementId: "G-V3TKRXKCV6"
};
const db = firebase.database();

async function genText() {
	msg.innerHTML += "<li class='sent'>"+msgTxt.value+"</li>"
	fetch("https://api.ipify.org?format=json")
		.then(response => response.json())
		.then(data => {
			db.ref("chatPrompts/" + Date.now()).set({
				prompt: msgTxt.value,
				ip: data.ip
			});
		})
		.catch(error => {
			console.error("Error fetching IP address:", error)
		});
	fetch(`https://api.johnny-airlines.co.uk/prompt/${msgTxt.value}`)
	.then((response) => response.json())
	.then((data) => {
		msg.innerHTML += "<li class='recieve'>"+data.reply+"</li>"
	});
}

let msgTxt = document.getElementById("msg-input-txt")
let msgBtn = document.getElementById("msg-btn-txt")
let msg = document.getElementById("messages")

msgBtn.addEventListener("click", await genText, false)


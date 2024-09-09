import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.8.0/+esm" 

const firebaseConfig = {
  apiKey: "AIzaSyDEr38pIOpNXbqxC0OG2vlhSr-yGXyWnQw",
  authDomain: "johnny-airlines-b02a8.firebaseapp.com",
  projectId: "johnny-airlines-b02a8",
  storageBucket: "johnny-airlines-b02a8.appspot.com",
  messagingSenderId: "129767102004",
  appId: "1:129767102004:web:35c8b0b6b728970a0ddc61",
  measurementId: "G-N9369YGKL8"
};


const db = firebase.database();

const inference = new HfInference("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");
var messages = [{role:"user",content:"You are to be a personal assistant for the customers of Johnny Airlines. Please refrain from talking for more than a paragraph. Johnny Airlines is a website on which you will be accesible. Attempt to advertise to the customer to create an account on the UPDATE page. Encourage customers to spread the word. Johnny Airlines does not actually sell flights. It is meant for entertainment."},{role:"assistant",content:"Of course I would be happy to."}]

async function talk() {
	let txt = ""
	for await (const chunk of inference.chatCompletionStream({
		model: "mistralai/Mistral-Nemo-Instruct-2407",
		messages,
		max_tokens: 5000,
	})) {
		txt = txt.concat(chunk.choices[0]?.delta?.content);
	}
	return txt
}

async function genText() {
	messages.push({role:"user",content:msgTxt.value});
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
	let response = await talk()
	messages.push({role:"assistant",content:response});
	msg.innerHTML += "<li class='recieve'>"+response+"</li>"
}

let msgTxt = document.getElementById("msg-input-txt")
let msgBtn = document.getElementById("msg-btn-txt")
let msg = document.getElementById("messages")

msgBtn.addEventListener("click", await genText, false)


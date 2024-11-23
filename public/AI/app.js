const firebaseConfig = {
  apiKey: "AIzaSyDEr38pIOpNXbqxC0OG2vlhSr-yGXyWnQw",
  authDomain: "johnny-airlines-b02a8.firebaseapp.com",
  projectId: "johnny-airlines-b02a8",
  storageBucket: "johnny-airlines-b02a8.appspot.com",
  messagingSenderId: "129767102004",
  appId: "1:129767102004:web:35c8b0b6b728970a0ddc61",
  measurementId: "G-N9369YGKL8"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.database();

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
		{
			headers: {
				Authorization: "Bearer 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",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}

msgBtnImg = document.getElementById("msg-btn-img")

msgBtnImg.addEventListener("click", img_gen, false)

function img_gen() {
	document.getElementById("image").src = "https://cdn.dribbble.com/users/2973561/screenshots/5757826/loading__.gif"
	fetch("https://api.ipify.org?format=json")
		.then(response => response.json())
		.then(data => {
			db.ref("imgPrompts/" + Date.now()).set({
				prompt: document.getElementById("msg-input-img").value,
				ip: data.ip
			});
		})
		.catch(error => {
			console.error("Error fetching IP address:", error)
		});
	query({"inputs": document.getElementById("msg-input-img").value}).then((response) => {
		document.getElementById("image").src = URL.createObjectURL(response);
	});
}

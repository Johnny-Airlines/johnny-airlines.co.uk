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

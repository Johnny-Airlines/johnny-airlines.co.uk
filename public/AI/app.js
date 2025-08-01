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
	const url = `https://api.johnny-airlines.co.uk/genImg/${data}`
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		let json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
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
	query(document.getElementById("msg-input-img").value).then((response) => {
		console.log(response);
		let url = response.data[0].url;
		document.getElementById("image").src = url;
	});
}

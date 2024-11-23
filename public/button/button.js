import firebaseConfig from "../fConfig.js"
firebase.initializeApp(firebaseConfig);

var clickCountElement = document.getElementById("clickCount");


const db = firebase.database();
var clicks;
async function getClicks() {
	const dbRef = firebase.database().ref('clicks');
	const snapshot = await dbRef.once('value');
	const clicks = snapshot.val();
	return clicks;
}

getClicks().then(clicks => {
	clickCountElement.textContent = clicks;
});

const button = document.getElementById('mechanical-button');
button.addEventListener("click", () => {
    // Increment the click count in the database
    db.ref("clicks").transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });
});
db.ref("clicks").on("value", (snapshot) => {
	const clickCount = snapshot.val();
	clickCountElement.textContent = clickCount;
});
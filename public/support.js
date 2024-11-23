import firebaseConfig from "./fConfig.js"
firebase.initializeApp(firebaseConfig)	
var database = firebase.database();


function report() {
	var bugText = document.getElementById("bug").value;
	var newBugRef = database.ref("/bugs").push();
	newBugRef.set({
		text:bugText
	});
	window.alert("BUG SENT!");
}

const button = document.getElementById('button');
button.addEventListener("click", () => {
    report()
});

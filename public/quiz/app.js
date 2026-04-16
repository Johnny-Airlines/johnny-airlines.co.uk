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
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/v8/firebase.User
		var uid = user.uid;
		const displayName = user.displayName;
		const email =
			user.email.replace("@johnny-airlines.co.uk", "") || prompt("Username: ");
		const photoURL = user.photoURL;
        alert("Signed in as " + displayName + " (" + email + ")");
        loadQuiz();
	} else {
		//Redirect user to sign in page if not signed in
		window.location.href = "./accounts.html";
	}
});

async function loadJSON() {
    const response = await fetch("./questions.json");
    const data = await response.json();
    return data;
}

var question;
function loadQuiz() {
    loadJSON().then((data) => {
        questions = data;
        nextQuestion();
    });
}
function nextQuestion() {
    question = questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("question").innerText = question.Question;
}

function buzz() {
    document.getElementById("answerDialog").showModal();
}

function submit() {
    document.getElementById("answerDialog").close();
    document.getElementById("resultsDialog").showModal();
    const answer = document.getElementById("answer").value;
    if (answer.toLowerCase() === question.Answer.toLowerCase()) {
        document.getElementById("results").innerText = "Correct!";
        setTimeout(() => {
            bonus();
        },1000);
    } else {
        document.getElementById("results").innerText = "Incorrect! The correct answer was: " + question.Answer;
        setTimeout(() => {
            nextQuestion();
        },1000);
    }
    setTimeout(() => {
        document.getElementById("resultsDialog").close();
    },1000);
}
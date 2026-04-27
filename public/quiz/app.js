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

var questions;
var questionSet;
var question;
var results = document.getElementById("results");
var isBonus = false;
var bonusIndex = 0;
var remainingOptions = [];
var numOfSubmissionsRemaining = 0;

function loadQuiz() {
    loadJSON().then((data) => {
        questions = data;
		document.getElementById("start").disabled = false;
		document.getElementById("start").innerText = "Start";
    });
}

function nextQuestion() {
	if (!isBonus) {
		questionSet = questions[Math.floor(Math.random() * questions.length)];
		//questionSet = questions[4];
		question = questionSet;
	} else if (bonusIndex == questionSet.Bonuses.length) {
		bonusIndex = 0;
		isBonus = false;
		nextQuestion();
		return;
	} else {
		question = questionSet.Bonuses[bonusIndex];
		bonusIndex++;
	}
	let delay = 0;
	for (const word of question.Question.split(" ")) {
		setTimeout(()=>{
			document.getElementById("question").innerText = word;
		},delay);
		delay += 1000;
	}
	setTimeout(()=>{
		document.getElementById("question").innerText = "";
	},delay);
}

function buzz() {
    document.getElementById("answerDialog").showModal();
	let id = setTimeout(function() {}, 0);
	while (id--) {
		clearTimeout(id);
	}
	document.getElementById("question").innerText = "You Buzzed!";
	if (typeof question.Type == "number") {
		document.getElementById("help").innerText = "Since you need to submit more than one answer hit submit each answer individually.";
		remainingOptions = structuredClone(question.Answer);
		numOfSubmissionsRemaining = question.Type;
	}
}

function start() {
	document.getElementById("container").showModal();
	document.getElementById("start").style.display = "none";
	nextQuestion();
}

function submit() {
    document.getElementById("answerDialog").close();
	document.getElementById("resultsDialog").showModal();
    setTimeout(() => {
        document.getElementById("resultsDialog").close();
    },1000);
	const answer = document.getElementById("answer").value;
	document.getElementById("answer").value = "";
	if (question.Type == "Regular") {
		if (answer.toLowerCase() === question.Answer.toLowerCase()) {
			results.innerText = "Correct!";
			setTimeout(() => {
				isBonus = true;
				nextQuestion();
			},1000);
			return;
		} else {
			results.innerText = `Incorrect! The correct answer was: ${question.Answer}`;
			setTimeout(() => {
				nextQuestion();
			},1000);
			return;
		}
	}
	if (question.Type == "ANY") {
		for (const option of question.Answer) {
			if (option.toLowerCase() == answer.toLowerCase()) {
				results.innerText = "Correct!";
				setTimeout(() => {
					bonus();
				},1000);
				return;
			}
		}
		results.innerText = "Incorrect! Any of the following are acceptable: "
		for (const option of question.Answer) {
			results.innerText += `${option}, `
		}
		results.innerText = results.innerText.substring(0,results.innerText.length-1)
		return;
	}
	if (typeof question.Type == "number") {
		let isCorrect = false;
		for (const [index, option] of Object.entries(remainingOptions)) {
			if (option.toLowerCase() == answer.toLowerCase()) {
				remainingOptions.splice(index,1);
				isCorrect = true;
				break;
			}
		}
		if (isCorrect) {
			results.innerText = "Correct!";
		} else {
			results.innerText = "Incorrect!";
		}
		numOfSubmissionsRemaining -= 1;
		if (numOfSubmissionsRemaining >= 1) {
			setTimeout(() => {
				document.getElementById("answerDialog").showModal();
			},1000);
		} else {
			if (remainingOptions.length != 0) {
				results.innerText += " The other remaining options are: "
				for (const option of remainingOptions) {
					results.innerText += `${option}, `
				}
				results.innerText = results.innerText.substring(0,results.innerText.length-1)
			}
			setTimeout(() => {
				nextQuestion();
			},1000);
		}
		return;
	}
}

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
var score = 0; 

function incrementScore(val) {
    score += val;
	document.getElementById("score").innerText = `Score: ${score}`;
}

function loadQuiz() {
    loadJSON().then((data) => {
        questions = data;
		document.getElementById("start").disabled = false;
		document.getElementById("start").innerText = "Start";
    });
}

function nextQuestion() {
	focus(document)
	if (!isBonus) {
		questionSet = questions[Math.floor(Math.random() * questions.length)];
		questionSet = questions[4];
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
		delay += word.length*100 + 300;
	}
	setTimeout(()=>{
		document.getElementById("question").innerText = "";
	},delay);
}

function buzz() {
    document.getElementById("answerDialog").showModal();
	setTimeout(()=>{document.getElementById("answer").value = ""},100);
	let id = setTimeout(function() {}, 0);
	while (id--) {
		clearTimeout(id);
	}
	document.getElementById("question").innerText = "You Buzzed!";
	if (typeof question.Type == "number") {
		document.getElementById("help").innerText = "Submit answers one at a time.";
		remainingOptions = structuredClone(question.Answer);
		numOfSubmissionsRemaining = question.Type;
	} else {
		numOfSubmissionsRemaining = 1;
	}
}

function start() {
	document.getElementById("container").showModal();
	document.getElementById("start").style.display = "none";
	document.addEventListener("keydown", (event) => {
		if (event.code == "Space" && !document.getElementById("answerDialog").open && !document.getElementById("resultsDialog").open) {
			buzz();
		}
	});
	nextQuestion();
}

function dismissPopup() {
	document.getElementById("dismissPopup").disabled = true;
	document.getElementById("dispute").disabled = true;
	document.getElementById("resultsDialog").close();
	nextQuestion();
}

function submit() {
	if (numOfSubmissionsRemaining == 1) {
		setTimeout(() => {
			document.getElementById("dismissPopup").disabled = false;
			document.getElementById("dismissPopup").focus();
			document.getElementById("dispute").disabled = false;
		}, 1000);
		document.getElementById("answerDialog").close();
		document.getElementById("resultsDialog").showModal();
	}
	const answer = document.getElementById("answer").value.trim();
	document.getElementById("answer").value = "";
	if (question.Type == "Regular") {
		if (answer.toLowerCase() === question.Answer.toLowerCase()) {
			results.innerText = "Correct!";
			isBonus = true;
			incrementScore(10);
			return;
		} else {
			results.innerText = `Incorrect! The correct answer was: ${question.Answer}`;
			return;
		}
	}
	if (question.Type == "ANY") {
		for (const option of question.Answer) {
			if (option.toLowerCase() == answer.toLowerCase()) {
				results.innerText = "Correct!";
				incrementScore(10);
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
			incrementScore(10);
			results.innerText = "Correct!";
		} else {
			results.innerText = "Incorrect!";
		}
		numOfSubmissionsRemaining -= 1;
		if (numOfSubmissionsRemaining > 1) {
			pass
		} else {
			if (remainingOptions.length != 0) {
				results.innerText += " The other remaining options are: "
				for (const option of remainingOptions) {
					results.innerText += `${option}, `
				}
				results.innerText = results.innerText.substring(0,results.innerText.length-1)
			}
		}
		return;
	}
}

document.getElementById("answer").addEventListener("keydown", (event) => {
	if (event.code == "Enter") {
		submit();
	}
});
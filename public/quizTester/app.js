var quizData;
getData().then(resp => quizData=resp).catch(e=>console.log(e));

var quizNumber = 0;
var correctNumber = 0;

function setQuestion() {
	quizNumber += 1;
	quizObject = quizData.results[quizNumber]
	console.log(quizObject)
	document.getElementById("currentQuestion").innerText = quizObject.question;
	correctNumber = Math.floor(Math.random()*4)
	answers = quizObject.incorrect_answers;
	answers = answers.splice(correctNumber, 0, quizObject.correct_answer)
	console.log(answers)
	for (let i = 0; i < 4; i++) {
		document.getElementById(`label${i+1}`).innerText = quizObject.incorrect_answers[i]
	}
}

function checkQuestion() {
	if (document.getElementById(`${correctNumber+1}`).checked == true) {
		alert("correct")
	} else {
		alert(quizData.results[quizNumber].correct_answer)
	}
	setQuestion()
}

async function getData() {
	const url = "https://opentdb.com/api.php?amount=50&category=9&difficulty=medium&type=multiple";
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return await json;
	} catch (error) {
		console.error(error.message);
	}
}


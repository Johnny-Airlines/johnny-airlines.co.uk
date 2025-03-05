var quizData;
getData().then(resp => quizData=resp).catch(e=>console.log(e));

var quizNumber = 0;

function setQuestion() {
	quizNumber += 1;
	quizObject = quizData.results[quizNumber]
	document.getElementById("currentQuestion").innerText = quizObject.question;
}

function checkQuestion() {
	if (document.getElementById("answer").value == quizData.results[quizNumber].correct_answer) {
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


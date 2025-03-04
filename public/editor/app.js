monaco.editor.setTheme('vs-dark')

var editor = monaco.editor.create(document.getElementById('container'), {
	value: ['def x():', '\tprint("hey")', ''].join('\n'),
	language: 'python',
});
async function sendData(data) {
	// Construct a FormData instance
	const formData = new FormData();

	// Add a text field
	//formData.append("name", "Pomegranate");

	// Add a file
	/*
	const selection = await window.showOpenFilePicker();
	if (selection.length > 0) {
		const file = await selection[0].getFile();
		formData.append("file", file);
	}*/

	const file = new File(editor.getValue().split(""), document.getElementById("filenameInput").value);
	formData.append("file",file);

	try {
		const response = await fetch("http://api.johnny-airlines.co.uk:5000/uploadFile", {
			method: "POST",
			// Set the FormData instance as the request body
			body: formData,
			headers: {
				'Access-Control-Allow-Origin':'*'
			}
		});
		alert(await response.body)
		alert(await response.json())
		console.log(await response.json());
	} catch (e) {
		alert(e.stack)
		console.error(e);
	}
}

async function runFile() {
	const url = `http://api.johnny-airlines.co.uk:5000/runPyFile/${document.getElementById("filenameInput").value}/a`
	try {
		const response = await fetch(url);
		alert(response.ok)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const json = await response.text();
		document.getElementById("output").value = json
	} catch (error) {
		alert(error.message)
		console.error(error.message);
	}
}


document.getElementById("sendFileBtn").addEventListener("click", sendData);
document.getElementById("runCodeBtn").addEventListener("click", runFile);

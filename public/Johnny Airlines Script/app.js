"use strict"

let interfaceElement = document.getElementById("interface");
let textBody = "user> "
let cursorVisible = false;

setInterval(()=>{
	cursorVisible = cursorVisible ? false : true;
	if (cursorVisible) {
		interfaceElement.innerHTML = textBody + "|"
	} else {
		interfaceElement.innerHTML = textBody;
	}
},500);

window.addEventListener("keydown", (e) => {
	if (e.key.length != 1) {
		if (e.key == "Backspace") {
			textBody = textBody.slice(0,-1);
		} else if (e.key == "Space") {
			textBody = textBody + " ";
		} else if (e.key == "Enter") { 
			rep();
		} else {
			console.log(e.key)
		}	
	} else {
		textBody += e.key
	}
	interfaceElement.innerHTML = textBody + "|"
});

const repl_env = {
	"+": (a,b) => {return a+b},
	"-": (a,b) => {return a-b},
	"*": (a,b) => {return a*b},
	"/": (a,b) => {return int(a/b)}
}

class Reader {
	constructor(tokens) {
		this.tokens = tokens;
		this.position = 0;
	}

	next() {
		this.position += 1;
		return this.tokens[this.position-1];
	}

	peek() {
		return this.tokens[this.position];
	}
}

const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
function tokenize(string) {
	const matches = string.matchAll(re);
	let tokens = [];
	for ( const match of matches ) {
		const token = match[1];
		tokens.push(token);
	};
	return tokens;
}

function read_form(reader) {
	const token = reader.peek();
	const firstChar = token[0];
	switch (firstChar) {
		case "(":
			return read_list(reader);
		default:
			return read_atom(reader);
	}
}

function read_list(reader) {
	reader.next();
	let token = read_form(reader);
	let tokens = [token];
	while (token != ")") {
		token = read_form(reader);	
		tokens.push(token);
	};
	tokens = tokens.slice(0,-1);
	return tokens;
}

function read_atom(reader) {
	return reader.next();
}

function read_str(string) {
	let reader = new Reader(tokenize(string))
	return read_form(reader)
}

function read() {
	let lines = textBody.split("<br>");
	let expr = lines[lines.length-1].replace("user> ","");
	return read_str(expr);
}

function evaluate(ast) {
	let firstParamater = ast[0];
	switch (typeof(firstParamater)) {
		case "object":
			if (firstParamater.length != 0) {
				
			}
			break;
		default:

	}
	return ast;
}

function print(output) {
	textBody += "<br>output> " + pr_str(output) + "<br>user> " 
}

function rep() {
	print(evaluate(read(),repl_env));
}

function pr_str(data) {
	if (typeof data === "object") {
		let a = "(";
		for (const val of data) {
			a += pr_str(val) + " "
		}
		a = a.slice(0,-1);
		a += ")"
		return a;
	} else {
		return String(data);
	}
}

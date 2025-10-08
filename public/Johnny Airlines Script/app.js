"use strict"

let interfaceElement = document.getElementById("interface");
let textBody = "> "
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
	"+": (a,b) => {return a.value+b.value},
	"-": (a,b) => {return a.value-b.value},
	"*": (a,b) => {return a.value*b.value},
	"/": (a,b) => {return Math.floor(a.value/b.value)}
}

class MalType {
	constructor(string) {
		if (string == "+" || string == "-" || string == "*" || string == "/") {
			this.type = "symbol";
			this.value = string;
		} else if (string == "(" || string == ")") {
			this.type = "parenthesis";
			this.value = string;
		} else if (!isNaN(string)) {
			this.type = "number";
			this.value = Number(string)
		} else if (string == "list") {
			this.type = "list"
			this.value = [];
		}
	}

	append(token) {
		this.value.push(token)
	}

	cutEnd() {
		this.value = this.value.slice(0,-1);
	}
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

	read_form() {
		const token = this.peek();
		const firstChar = token[0];
		switch (firstChar) {
			case "(":
				return this.read_list();
			default:
				return this.read_atom();
		}
	}

	read_list() {
		this.next();
		let token = this.read_form();
		let tokens = new MalType("list");
		tokens.append(token);
		while (token.value != ")") {
			token = this.read_form();
			tokens.append(token);
		};
		tokens.cutEnd();
		return tokens;
	}

	read_atom() {
		return new MalType(this.next());
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


function read_str(string) {
	let tokens = tokenize(string)
	let reader = new Reader(tokens)
	return reader.read_form();
}

function read() {
	let lines = textBody.split("<br>");
	let expr = lines[lines.length-1].replace("> ","");
	return read_str(expr);
}

function evaluate(ast) {
	let firstParamater = ast;
	if (firstParamater.type == "symbol") {
		return repl_env[firstParamater.value];
	} else if (firstParamater.type == "list") {
		if (firstParamater.value.length != 0) {
			let func = evaluate(firstParamater.value.shift());
			let args = [];
			for (const arg of firstParamater.value) {
				args.push(evaluate(arg));
			}
			return new MalType(func(...args));
		}
	} else {
		return ast;
	};
}

function print(output) {
	textBody += "<br>" + pr_str(output) + "<br>> " 
}

function rep() {
	print(evaluate(read()));
}

function pr_str(data) {
	if (data.type == "list") {
		let a = "(";
		for (const val of data.value) {
			a += pr_str(val) + " "
		}
		a = a.slice(0,-1);
		a += ")"
		return a;
	} else {
		return String(data.value);
	}
}

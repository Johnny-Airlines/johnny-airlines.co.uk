function display(num) {
	document.getElementById("input").value += num;
}
function calc() {
	const input = document.getElementById("input").value;
	const result1 = input.replaceAll("×", "*");
	const result2 = result1.replaceAll("÷", "/")
	document.getElementById("input").value = math.eval(result2);
}
function clr() {
	document.getElementById("input").value = "";
}
function del() {
	document.getElementById("input").value = document.getElementById("input").value.slice(0,-1);
}
document.getElementById("input").addEventListener("keypress", function(event) {
	//event.preventDefault();
	if (event.keyCode === 13) {
		document.getElementById("calc").click();
	}
});
var windows = document.getElementsByClassName("grid-item");
var images = document.getElementsByName("img");
var t = document.getElementById("time");
var time = 100;
t.innerHTML = "Time remaining: " + time + "s";
var s = document.getElementById("score");
var score = 0;
s.innerHTML = "Score: " + score + "/100";

function game() {
	for (let i = 0; i < 9; i++) {
		windows[i].style.backgroundImage = 'url("ws.png")';
		images[i].style.display = "none";
	}
	open = Math.floor(Math.random() * 9);
	windows[open].style.backgroundImage = 'url("wo.png")';
	images[open].style.display = "";
	time -= 1;
	t.innerHTML = "Time remaining: " + time + "s";
}

function check() {
	var x = event.clientX;
	var y = event.clientY;
	el = document.elementFromPoint(x,y);
	if (el.nodeName == 'IMG') {
		el.style.display = "none";
		el.parentNode.style.backgroundImage = 'url("ws.png")';
		score += 1;
		s.innerHTML = "Score: " + score + "/100";
	}
}

function stop() {
	clearInterval(gameLoop);
	alert("Your score is: " + score)
}

function start() {
	document.getElementById("start").remove();
	gameLoop = setInterval(game, 1000);
	setTimeout(stop, 100000);
}
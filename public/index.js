for (var x=0; x < document.getElementsByTagName("grid-item").length; x++) {var randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');document.getElementsByTagName("grid-item")[x].style.border = "10px solid " + randomColor;document.getElementsByTagName("grid-item")[x].style.backgroundColor = randomColor;}; 
var randUrls=[
	"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
	"/BSOD.html",
	"/whyareyoulookingattheurl.html"
	]
randNum = Math.floor(Math.random()*500)
if (randNum <= 2) {
	window.location=randUrls[randNum]
}
if (randNum > 400) {
	window.location = randUrls[0]
}

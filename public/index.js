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

logo = document.getElementById("logoHref")

selectedTexts = [];
isEasterEggFound = false;

const selectionDetector = setInterval(() => {
	currentSelection = window.getSelection().toString();
	if (!selectedTexts.includes(currentSelection)) {
		selectedTexts.push(currentSelection);
		if (selectedTexts.includes("Johnny") && selectedTexts.includes("Airlines") && selectedTexts.includes("Johnny Airlines")) {
			selectedTexts = [];
			logo.href = "https://johnny-airlines.co.uk/dev/";
			setTimeout(()=>{
				logo.href = "https://johnny-airlines.co.uk";
			},5000);
			alert("Easter egg found!");
			console.log("Highlighting easter egg found!");
		}
	}
},10);

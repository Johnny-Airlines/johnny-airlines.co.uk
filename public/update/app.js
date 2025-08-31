(function(){ "use strict"
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

//Database refrences
const db = firebase.database();
const playersRef = db.ref("players");

//Status info
var isOfflineForDatabase = {
	state: "offline"
}

var isOnlineForDatabase = {
	state: "online"
}

//Sign in user
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/v8/firebase.User
		var uid = user.uid;
		const displayName = user.displayName;
		const email =
			user.email.replace("@johnny-airlines.co.uk", "") || prompt("");
		const photoURL = user.photoURL;
		let PixelFont = new FontFace(
			"DEFAULT FONT",
			"url('./Jersey15-Regular.ttf')"
		);
		PixelFont.load().then((font) => {
			document.fonts.add(font)
			let SkyFont = new FontFace(
				"SKYFONT",
				"url('./Skyfont-NonCommercial.otf')"
			);
			SkyFont.load().then((font) => {
				document.fonts.add(font);
				startGame(displayName, email, uid, photoURL);
			});
			
		});
	} else {
		window.location.href = "../accounts.html";
	}
});

//Game Area
var gameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		gameArea.resize();
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	resize: function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
};

//Resizing game area if window resized
addEventListener("resize", (event) => {
	gameArea.resize();
});

//Chatbox focus detection
let chatFocus = false
document.getElementById("message-input").addEventListener("focus", (event) => { chatFocus = true })
document.getElementById("message-input").addEventListener("blur", (event) => { chatFocus = false })

//Key detection
let keysPressed = [];
document.addEventListener("keydown", (key) => {
	keysPressed.push(key.key);
	keysPressed = [...new Set(keysPressed)];
	for (let k in keysPressed) {
		if (isDialogueOpen) {
			if (keysPressed[k] == "Enter" && !chatFocus) {
				isDialogueOpen = false;
				if (isDialoguePrompt) {
					if (dialoguePromptUse == "changeDisplayName") {
						if (dialoguePrompt == "") {
							dialogue("Your display name can not be nothing",false,0)					
						} else {
							updateDisplayName(dialoguePrompt)
						}
					}
					if (dialoguePromptUse == "jumble") {
						if (dialoguePrompt.toUpperCase() == jumbleData.currentJumble) {
							tickets = tickets + 5
							db.ref(`users/${myPlayer.id}`).update({
								tickets,
							});
							dialogue("Correct, you get 5 tickets, come back again tommorow!",false,10000)
						} else {
							dialogue("WRONG. Try again tommorow!",false,10000)
						}

					}
					if (dialoguePromptUse == "sendCommand") {
						if (isValidCommand(dialoguePrompt)) {
							db.ref(`cmds`).push({
								command: dialoguePrompt,
							});
						} else {
							dialogue("Invalid command",false,2000)
						}
					}
					if (dialoguePromptUse == "sendPromptCMD") {
						let unames = []
						for (let player in players) {
							unames.push(players[player]["username"])
						}
						["hmmmm","johnnyairlinesceo","frazeldazel"].forEach((person) => {
							if (unames.includes(person)) {
								let command = `sendMessage ${person} "${dialoguePrompt}"`
								db.ref(`cmds`).push({
									command,
								});
							};
						});
					}
				}
				isDialoguePrompt = false;
				dialoguePrompt = "";
			}
			if (isDialoguePrompt) {
				if (keysPressed[k] == "Backspace") {
					dialoguePrompt = dialoguePrompt.slice(0,dialoguePrompt.length-1);
				} else if (keysPressed[k].length == 1){
					dialoguePrompt = `${dialoguePrompt}${keysPressed[k]}`
				}
				keysPressed.splice(keysPressed.indexOf(keysPressed[k]),1)
			}
		}
		else {
			if (keysPressed[k] == " " && !chatFocus) {
				interact();
			}
			if (keysPressed[k] == "q" && !chatFocus && prisonCmdId == "N/A") {
				dropBomb();
			}
			if (keysPressed[k] == "e" && !chatFocus && prisonCmdId == "N/A") {
				shoot();
			}
			if (keysPressed[k] == "f" && !chatFocus && prisonCmdId == "N/A") {
				missileShoot();
			}
			if (keysPressed[k] == "/" && !chatFocus) {
				document.getElementById("message-input").focus();
				document.getElementById("message-input").select();
			}
			if (keysPressed[k] == "Enter" && chatFocus) {
				document.getElementById("message-btn").click();
			}
			if (keysPressed[k] == "p" && !chatFocus) {
				mouseDown = 0;
				myPlayer.mouseDown = false;
			}
			if (keysPressed[k] == "l" && !chatFocus) {
				cloudsOn = cloudsOn ? false : true;
			}
		}
	}
});
document.addEventListener("keyup", (key) => {
	keysPressed = keysPressed.filter((item) => item !== key.key);
});
//Mousemove detection
onmousemove = function (e) {
	var diffX = e.clientX - gameArea.canvas.width / 2;
	var diffY = e.clientY - gameArea.canvas.height / 2;
	try {
		myPlayer.angle = Math.atan2(diffY, diffX) + Math.PI / 2;
	} catch (e) {
		if (e.message = 'can\'t access property "angle", myPlayer is undefined') {
			console.log("Welcome to Johnny Airlines!");
		} else {
			throw e;
		}
	}
};
//Mousedown detection
let mouseDown = 0;
const myAudio = document.createElement("audio");
window.onmousedown = (e) => {
	mouseDown = 1;
	myPlayer.mouseDown = 1;
	myAudio.play()
}
window.onmouseup = () => {
	mouseDown = 0;
	myPlayer.mouseDown = 0;
};

//MOBILE SUPPORT
const isMobile = window.matchMedia('(pointer: coarse)').matches;
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickTouch = { x: 0, y: 0 };
let joystickRadius = 50; // max drag radius
if (isMobile) {
	window.addEventListener('touchstart', handleTouchStart, { passive: false });
	window.addEventListener('touchmove', handleTouchMove, { passive: false });
	window.addEventListener('touchend', handleTouchEnd, { passive: false });
	document.getElementById("chatCont").remove();
} else {
	document.getElementById("controls").remove();
}
function handleTouchStart(e) {
	e.preventDefault();
	const touch = e.touches[0];
	const rect = gameArea.canvas.getBoundingClientRect();
	const x = touch.clientX - rect.left;
	const y = touch.clientY - rect.top;

	// Only activate joystick if touch is on left half
	if (x < gameArea.canvas.width / 2) {
		joystickActive = true;
		joystickCenter.x = x;
		joystickCenter.y = y;
		joystickTouch.x = x;
		joystickTouch.y = y;
		mouseDown = 1;
		myPlayer.mouseDown = 1;
		myAudio.play();
	}
}

function handleTouchMove(e) {
	if (!joystickActive) return;
	const touch = e.touches[0];
	const rect = gameArea.canvas.getBoundingClientRect();
	let x = touch.clientX - rect.left;
	let y = touch.clientY - rect.top;


	// Limit drag distance to joystickRadius
	const dx = x - joystickCenter.x;
	const dy = y - joystickCenter.y;
	const distance = Math.hypot(dx, dy);
	myPlayer.angle = Math.atan2(dy, dx) + Math.PI / 2;


	if (distance > joystickRadius) {
		const angle = Math.atan2(dy, dx);
		x = joystickCenter.x + Math.cos(angle) * joystickRadius;
		y = joystickCenter.y + Math.sin(angle) * joystickRadius;
	}

	joystickTouch.x = x;
	joystickTouch.y = y;
}

function handleTouchEnd(e) {
	joystickActive = false;
	mouseDown = 0;
	myPlayer.mouseDown = 0;
}
function drawJoystick(ctx) {
	if (!joystickActive) return;

	// Base circle
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.lineWidth = 2;
	ctx.arc(joystickCenter.x, joystickCenter.y, joystickRadius, 0, Math.PI * 2);
	ctx.stroke();

	// Thumb circle
	ctx.beginPath();
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.arc(joystickTouch.x, joystickTouch.y, 20, 0, Math.PI * 2);
	ctx.fill();
}

//Images
const plane = new Image();
const bg = new Image();
bg.src = "bg.png";
const btn = new Image();
btn.src = "bUnclicked.png";
const playerPoint = new Image();
playerPoint.src = "playerPoint.png";
const otherPlayerPoints = new Image();
otherPlayerPoints.src = "otherPlayerPoints.png";
const mini = new Image();
mini.src = "minimap.png";
const up = new Image();
up.src = "https://johnny-airlines.co.uk/up.png";
const bulletImg = new Image();
bulletImg.src = "https://johnny-airlines.co.uk/bullet.png";
const towersImg = new Image();
towersImg.src = "https://johnny-airlines.co.uk/towers.png";
const jerryCanImage = new Image();
jerryCanImage.src = "../jerryCan.png";
const jerryCanIconImage = new Image();
jerryCanIconImage.src = "../jerryCanIcon.png";
const heartImage = new Image();
heartImage.src = "../heart.png";
const rocketImg = new Image();
rocketImg.src = "../rocket.png"
const gambleImg = new Image();
gambleImg.src = "../gamble.png"
const die1 = new Image();
die1.src = "../die/1.png"
const die2 = new Image();
die2.src = "../die/2.png"
const die3 = new Image();
die3.src = "../die/3.png"
const die4 = new Image();
die4.src = "../die/4.png"
const die5 = new Image();
die5.src = "../die/5.png"
const die6 = new Image();
die6.src = "../die/6.png"
const diceImages = [die1,die2,die3,die4,die5,die6];
const jumbleImg = new Image();
jumbleImg.src = "../jumble.png";
const windowShutImg = new Image();
windowShutImg.src = "../Whack A James/ws.png";
const windowOpenImg = new Image();
windowOpenImg.src = "../Whack A James/wo.png";
const jamesHappyImg = new Image();
jamesHappyImg.src = "../Whack A James/jh.png";
const jamesSadImg = new Image();
jamesSadImg.src = "../Whack A James/js.png";
const cloudsImg = new Image();
cloudsImg.src = "./clouds.png";
const skylineImg = new Image();
skylineImg.src = "./skyline.png";
const pipeImg = new Image();
pipeImg.src = "./pipe.png";
const FPImg = new Image();
FPImg.src = Math.floor(Math.random()*2) == 1 ? "./red.png" : "./blue.png";
const bananaImg = new Image();
bananaImg.src = "../banana/banana.png";
//CHRISTMAS
const christmasTreeFrame1 = new Image();
christmasTreeFrame1.src = "../christmasTreeFrames/1.png";
const christmasTreeFrame2 = new Image();
christmasTreeFrame2.src = "../christmasTreeFrames/2.png";
const ticketImage = new Image();
ticketImage.src = "../Ticket.png"
var cFrame = 1;

//Other Variables
let ctx;
var myPlayer;
let players = [];
let bombs = [];
let bullets = [];
let tickets;
var jerryCans = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
var ticketX = 0;
var ticketY = 0;
var safeX;
var safeY;
var prisonCmdId = "N/A";
var lastShot = Date.now();
var lastBomb = Date.now();
var lastMissile = Date.now()
var dieNum1 = 1;
var dieNum2 = 6;
var diceRoll = null;
var jumbleData = {currentJumble: "TESTING",scramble:"ITTSEGN", lastJumbleUpdate: 0};
var lastJumbleSolve = 0;
var whackAJamesLayout = [["windowShutImg","windowShutImg","windowShutImg"],["windowShutImg","windowShutImg","jamesSadImg"],["windowShutImg","windowShutImg","windowShutImg"]]
var isPlayingWAJ = false;
var WAJscore = 0;
var WAJtime = 0;
var cloudPos = [8000,8000];
var cloudDirection = [Math.floor(Math.random()*10)-5,Math.floor(Math.random()*10)-5]
var cloudsOn = true;
var isDialogueOpen = false;
var dialogueMsg = "";
var dialoguePrompt = "";
var isDialoguePrompt = false;
var dialoguePromptUse = "";
var isDialoguePromptCursorTimer = 0;
var isPlayingFP = false;
var FPbgLocation = 0;
var FPpipeLocations = [];
var FPheight = 128;
var FPspeed = 0;
var FPpoints = 0;
let pipeSpawner;
var bananaClickerData = {"bananas":0};
var lastBananaClick = Date.now();
let noticeboardData = {"lastUpdate":"LOADING","notices":["LOADING","LOADING","LOADING","LOADING","LOADING"]};
let leaderboardData = null;

const planeData = {
	"Plane":{"centerPoint":[33,30],"music":null},
	"colour_planes/Blue":{"centerPoint":[33,30],"music":null},
	"colour_planes/Brown":{"centerPoint":[33,30],"music":null},
	"colour_planes/Purple":{"centerPoint":[33,30],"music":null},
	"colour_planes/Green":{"centerPoint":[33,30],"music":null},
	"colour_planes/Grey":{"centerPoint":[33,30],"music":null},
	"colour_planes/Pink":{"centerPoint":[33,30],"music":null},
	"colour_planes/White":{"centerPoint":[33,30],"music":null},
	"colour_planes/Yellow":{"centerPoint":[33,30],"music":null},
	"Disco":{"centerPoint":[44,47],"music":null},
	"Rainbow":{"centerPoint":[29,31],"music":null},
	"Spitfire":{"centerPoint":[29,35],"music":null},
	"christmasPlane":{"centerPoint":[29,44],"music":"https://johnny-airlines.co.uk/jingleBells.mp3"},
	"CEO":{"centerPoint":[27,29],"music":null},
	"mop":{"centerPoint":[25,49],"music":null},
	"LGD":{"centerPoint":[33,51],"music":null},
	"purple":{"centerPoint":[38,47],"music":null},
	"invis":{"centerPoint":[0,0],"music":null},
	"paper":{"centerPoint":[33,40],"music":null},
	"SEC":{"centerPoint":[27,29],"music":null},
	"coconut":{"centerPoint":[32,32],"music":"https://johnny-airlines.co.uk/island.mp3"},
	"shark":{"centerPoint":[132,222],"music":null},
	"OG":{"centerPoint":[27,29],"music":null},
}

//Particle Variables
var particleConfig = {
	particleNumber: 0,
	maxParticleSize: 4,
	maxSpeed: 1,
};
var colorPalette = {
	"default": {
		"colorVariation": 50,
		matter: [
			{ r: 255, g: 0, b: 0 }, // darkPRPL
			{ r: 78, g: 36, b: 42 }, // rockDust
			{ r: 252, g: 178, b: 96 }, // solorFlare
			{ r: 253, g: 238, b: 152 }, // totesASun
		],
	},
	"rainbow": {
		"colorVariation": 255791872360187236,
		matter: [
			{ r: 255, g: 255, b: 255 },
		],
	},
	"tristan": {
		"colorVariation": 0,
		matter: [
			{ r: 0, g: 204, b: 255 }, //Cyan
			{ r: 0, g: 0, b: 102 },//DARK blue
			{ r: 153, g: 0, b: 153},
		]
	}
};
var particleEffect = true;
var particles = [],
	centerX = gameArea.canvas.width / 2,
	centerY = gameArea.canvas.height / 2,
	drawBg;
var Particle = function (x, y, colour) {
	// X Coordinate
	this.x = x || 0;
	// Y Coordinate
	this.y = y || 0;
	// Radius of the space dust
	this.r = Math.ceil(Math.random() * particleConfig.maxParticleSize);
	// Color of the rock, given some randomness
	this.c = colorVariation(
		colorPalette[colour].matter[
			Math.floor(Math.random() * colorPalette[colour].matter.length)
		],
		colorPalette[colour].colorVariation,
		true,
	);
	// Speed of which the rock travels
	this.s = Math.pow(Math.ceil(Math.random() * particleConfig.maxSpeed), 0.7);
	// Direction the Rock flies
	this.d = Math.round(Math.random() * 360);
	this.t = Date.now();
};
drawBg = function (ctx, color) {
	ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};
var colorVariation = function (color, variation, returnString) {
	var r, g, b, a;
	r = Math.round(
		Math.random() * variation -
		variation / 2 +
		color.r,
	);
	g = Math.round(
		Math.random() * variation -
		variation / 2 +
		color.g,
	);
	b = Math.round(
		Math.random() * variation -
		variation / 2 +
		color.b,
	);
	a = Math.random() + 0.5;
	if (returnString) {
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	} else {
		return { r, g, b, a };
	}
};
var updateParticleModel = function (p) {
	var a = 180 - (p.d + 90); // find the 3rd angle
	p.d > 0 && p.d < 180
		? (p.x += (p.s * Math.sin(p.d)) / Math.sin(p.s))
		: (p.x -= (p.s * Math.sin(p.d)) / Math.sin(p.s));
	p.d > 90 && p.d < 270
		? (p.y += (p.s * Math.sin(a)) / Math.sin(p.s))
		: (p.y -= (p.s * Math.sin(a)) / Math.sin(p.s));
	return p;
};
var drawParticle = function (x, y, r, c) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.arc(
		x + myPlayer.x + gameArea.canvas.width / 2,
		y + myPlayer.y + gameArea.canvas.height / 2,
		r,
		0,
		2 * Math.PI,
		false,
	);
	ctx.fill();
	ctx.closePath();
};
var cleanUpArray = function () {
	particles = particles.filter((p) => {
		return Date.now() - p.t < 5000;
	});
};
var frame = function () {
	// Draw background first
	// Update Particle models to new position
	particles.map((p) => {
		return updateParticleModel(p);
	});
	// Draw em'
	particles.forEach((p) => {
		drawParticle(p.x, p.y, p.r, p.c);
	});
};

//Plane constructor
class p {
	constructor() {
		(this.username = ""), (this.displayName = ""), (this.size = 22 * 3);
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.id = 0;
		this.fuel = 0;
		this.acceleration = 2;
		this.plane = "";
		this.mouseDown = false;
		this.health = 100;
		this.contrailColour = "default";
	}
	update() {
		ctx = gameArea.context;

		ctx.textAlign = "center";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.drawImage(
			bg,
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2,
			16000,
			16000,
		);
		ctx.restore();
	}
	planeDraw() {
		ctx.save();
		ctx.translate(gameArea.canvas.width / 2, gameArea.canvas.height / 2);
		ctx.rotate(this.angle);
		var planeimg = new Image();
		planeimg.src = this.plane;
		/*ctx.drawImage(
			planeimg,
			-this.size / 2,
			-this.size / 2,
			planeimg.width,
			planeimg.height,
		);*/
			ctx.drawImage(
				planeimg,
				-planeData[this.plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].centerPoint[0],
				-planeData[this.plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].centerPoint[1],
				planeimg.width,
				planeimg.height,
			);
		ctx.restore();
		ctx.font = "24px DEFAULT FONT";
		ctx.textAlign = "center";
		ctx.fillStyle = "#00FFBA";
		ctx.fillText(
			this.displayName,
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2 - 35,
		);
		ctx.font = "12px DEFAULT FONT";
		ctx.fillText(
			this.username,
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2 - 25,
		);
	}
	draw() {
		ctx = gameArea.context;
		ctx.imageSmoothingEnabled = false;
		ctx.save();
		ctx.translate(
			-this.x + myPlayer.x + gameArea.canvas.width / 2,
			-this.y + myPlayer.y + gameArea.canvas.height / 2,
		);
		ctx.rotate(this.angle);
		var planeimg = new Image();
		planeimg.src = this.plane;
		/*ctx.drawImage(
			planeimg,
			-this.size / 2,
			-this.size / 2,
			planeimg.width,
			planeimg.height,
		);*/
			ctx.drawImage(
				planeimg,
				-planeData[this.plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].centerPoint[0],
				-planeData[this.plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].centerPoint[1],
				planeimg.width,
				planeimg.height,
			);
		ctx.restore();
		ctx.font = "24px DEFAULT FONT";
		ctx.textAlign = "center";
		ctx.fillStyle = "#932121";
		ctx.fillText(
			this.displayName,
			-this.x + myPlayer.x + gameArea.canvas.width / 2,
			-this.y + myPlayer.y + gameArea.canvas.height / 2 - 35,
		);
		ctx.font = "12px DEFAULT FONT";
		ctx.fillText(
			this.username,
			-this.x + myPlayer.x + gameArea.canvas.width / 2,
			-this.y + myPlayer.y + gameArea.canvas.height / 2 - 25,
		);
	}
}

class Bullet {
	constructor(x, y, angle, player, timestamp, key, isRocket) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.player = player;
		this.timestamp = timestamp;
		this.key = key;
		this.isRocket = isRocket;
	}
	draw() {
		ctx = gameArea.context;
		ctx.save();
		ctx.translate(
			-this.x + myPlayer.x + gameArea.canvas.width / 2,
			-this.y + myPlayer.y + gameArea.canvas.height / 2,
		);
		ctx.rotate(this.angle - (Math.PI / 2) * 3 + Math.PI);
		if (this.isRocket) {
			ctx.drawImage(rocketImg, 0, 0, -300 /4, -130 / 4);
		}
		else {
			ctx.drawImage(bulletImg, 0, 0, -300 / 16, -130 / 16);
		}
		ctx.restore();
	}
	update() {
		let speed = 75
		if (this.isRocket) {
			let selectedPlayerX = myPlayer.x
			let selectedPlayerY = myPlayer.y
			playersRef.once("value", (snapshot) => {
				let closestDist = Infinity;
				players = Object.values(snapshot.val())
				players.forEach((player) => {
					let distForPlayer = Math.sqrt((this.x-player.x)**2+(this.y-player.y)**2) 
					if (distForPlayer < closestDist && player.id != this.player) {
						closestDist = distForPlayer
						selectedPlayerX = player.x
						selectedPlayerY = player.y
					}
				})
			})
			this.angle = Math.atan2((selectedPlayerY-this.y),(selectedPlayerX-this.x)) + (Math.PI / 2) * 3
			speed = 25
		}

		this.x -= speed * Math.cos(this.angle + (Math.PI / 2) * 3);
		this.y -= speed * Math.sin(this.angle + (Math.PI / 2) * 3);
		db.ref(`bullets/${this.key}`).set(this);
		if (Date.now() - this.timestamp > 10000 && this.isRocket) {
			db.ref(`bullets/${this.key}`).remove();
		}
		else if (Date.now()-this.timestamp > 2000 && !this.isRocket) {
			db.ref(`bullets/${this.key}`).remove();
		}
	} 

}

//Bomb constuctor
class Bomb {
	constructor(x, y, frame, id, player) {
		this.x = x;
		this.y = y;
		this.frame = frame;
		this.id = id;
		this.player = player;
	}

	update() {
		this.frame++;
		if (this.frame >= 20) {
			db.ref(`bombs/${this.id}`).remove();
		}
	}

	draw() {
		var frameImage = new Image();
		frameImage.src = "https://johnny-airlines.co.uk/bomb/" + this.frame + ".png";
		drawImageAtFixedPosition(frameImage,-this.x-79,-this.y-69,78*2,69*2)
	}
}

const shuffle = str => [...str].sort(()=>Math.random()-.5).join('');
function daysSinceEpoch() {
	let currentDate = new Date();
	let epochDate = new Date(new Date().getTime()/1000);
	let res = Math.abs(currentDate - epochDate) / 1000;
	return Math.floor(res/86400);
}

function drawImageAtFixedPosition(image,x,y,width,height) {
	ctx = gameArea.context;
	ctx.drawImage(
		image,
		x + myPlayer.x + gameArea.canvas.width / 2,
		y + myPlayer.y + gameArea.canvas.height / 2,
		width,
		height,
	);
}

function dialogue(message, isPrompt, dismissTime) {
	dialogueMsg = message;
	isDialogueOpen = true;
	isDialoguePrompt = isPrompt;
	if (dismissTime != 0) {
		setTimeout(()=>{isDialogueOpen = false},dismissTime);
	}
}

function dialogueDraw() {
	ctx = gameArea.context;
	ctx.fillStyle = "#948c82"
	ctx.fillRect(
		gameArea.canvas.width / 2 - 505,
		gameArea.canvas.height / 2 - 105,
		1010,
		210,
	);
	ctx.fillStyle = "#fcf1e3"
	ctx.fillRect(
		gameArea.canvas.width / 2 - 500,
		gameArea.canvas.height / 2 - 100,
		1000,
		200,
	);
	ctx.font = "24px DEFAULT FONT";
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";
	ctx.fillText(
		dialogueMsg,
		gameArea.canvas.width / 2,
		gameArea.canvas.height / 2 - 35,
	);
	if (isDialoguePrompt) {
		isDialoguePromptCursorTimer += 1;
		isDialoguePromptCursorTimer = isDialoguePromptCursorTimer > 20 ? 0 : isDialoguePromptCursorTimer;
		ctx.fillStyle = "#000000"
		ctx.fillRect(
			gameArea.canvas.width / 2 - (dialoguePrompt.length * 6 + 5)-50,
			gameArea.canvas.height / 2 - 15 - 2.5,
			(dialoguePrompt.length * 12 + 10)+100,
			30,
		);
		ctx.fillStyle = "#ffffff"
		ctx.fillRect(
			gameArea.canvas.width / 2 - (dialoguePrompt.length * 6)-50,
			gameArea.canvas.height / 2 - 12.5 - 2.5,
			(dialoguePrompt.length * 12)+100,
			25,
		);
		ctx.fillStyle = "#000000"
		ctx.fillText(
			`${dialoguePrompt}${isDialoguePromptCursorTimer > 10 ? "|" : " "}`,
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2,
		);
		ctx.fillText(
			"Press Enter to submit",
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2 + 35,
		);
	} else {
		ctx.fillText(
			"Press Enter to dismiss this message",
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2,
		);
	}
}

function dropBomb() {
	if ((Date.now() - lastBomb) > 500) {
		lastBomb = Date.now()
		let key = db.ref().child('bombs').push().key;
		const bomb = new Bomb(
			myPlayer.x,
			myPlayer.y,
			0,
			key,
			myPlayer.id
		);
		db.ref(`bombs/${bomb.id}`).set(bomb);
	}
}

function shoot() {
	if ((Date.now() - lastShot) > 100) {
		lastShot = Date.now()
		let key = db.ref().child('bullets').push().key;
		let bullet = new Bullet(
			myPlayer.x,
			myPlayer.y,
			myPlayer.angle,
			myPlayer.id,
			Date.now(),
			key,
			false
		);
		db.ref(`bullets/${key}`).set(bullet);
	}
}

function missileShoot() {
	if ((Date.now() - lastMissile) > 2000) {
		lastMissile = Date.now()
		let key = db.ref().child('bullets').push().key;
		let bullet = new Bullet(
			myPlayer.x,
			myPlayer.y,
			myPlayer.angle,
			myPlayer.id,
			Date.now(),
			key,
			true
		);
		db.ref(`bullets/${key}`).set(bullet);
	}
}
document.getElementById("changeDisplayName").addEventListener("click",updateDisplayNamePrompt);
function updateDisplayNamePrompt() {
	document.getElementById("closebtn").click();
	dialogue("Enter new name here:",true,0)
	dialoguePromptUse = "changeDisplayName"
}
function updateDisplayName(name) {
	firebase
		.auth()
		.currentUser.updateProfile({
			displayName: name,
		})
		.then(() => {
			myPlayer.displayName = firebase.auth().currentUser.displayName;
			document.getElementById("overlaydname").innerHTML =
				firebase.auth().currentUser.displayName;
			document.getElementById("dname").innerHTML =
				firebase.auth().currentUser.displayName;
		});
}

//Drawing Functions
function buttonDraw() {
	ctx = gameArea.context;
	drawImageAtFixedPosition(btn,12249,3249,800,800)
	ctx.font = "250px DEFAULT FONT";
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";
	db.ref("clicks").on("value", (snapshot) => {
		const clickCount = snapshot.val();
		ctx.fillText(
			clickCount,
			12649 + myPlayer.x + gameArea.canvas.width / 2,
			3249 + myPlayer.y + gameArea.canvas.height / 2,
		);
	});
}

function noticeboardDrawText(boardPos,realHeight,fontSize,x,y,text) { 
	ctx = gameArea.context;
	ctx.font = `${fontSize}px SKYFONT`;
	ctx.textAlign = "left";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(boardPos.x + 1+x, boardPos.y-realHeight+realHeight*y, ctx.measureText(text).width-2,realHeight)
	ctx.fillStyle = "#000000";
	ctx.fillText(text,boardPos.x+x,boardPos.y+realHeight*y)
}

function noticeboard() {
	ctx = gameArea.context;
	ctx.fillStyle = "#000000";
	let boardPos = {"x":7500,"y":8300};
	boardPos.x += myPlayer.x + gameArea.canvas.width / 2;
	boardPos.y += myPlayer.y + gameArea.canvas.height / 2;
	noticeboardDrawText(boardPos,33,50,0,0,`Notice Board  Last update: ${noticeboardData.lastUpdate}`);
	//noticeboardDrawText(boardPos,realHeight,0,1,`Last update: ${noticeboardData.lastUpdate}`);
	noticeboardData.notices.forEach((notice,index) => {
		noticeboardDrawText(boardPos,26,40,0,index+1,notice);
	});
};

function leaderboardsDraw() {
	ctx = gameArea.context;
	ctx.fillStyle = "#000000";
	let boardPos = {"x":7400,"y":8500};
	boardPos.x += myPlayer.x + gameArea.canvas.width / 2;
	boardPos.y += myPlayer.y + gameArea.canvas.height / 2;
	noticeboardDrawText(boardPos,33,50,0,0,`Tickets Leaderboard`);
	if (leaderboardData == null) {
		noticeboardDrawText(boardPos,26,40,0,1,"LOADING");
		return;
	}
	noticeboardDrawText(boardPos,26,40,0,1,"Pos Username          Tickets")
	for (const property in leaderboardData.tickets) {
		if (property != "exclusions") {
			noticeboardDrawText(boardPos,26,40,0,parseInt(property)+1,`${property.padEnd(3," ")} ${String(leaderboardData.tickets[property].username).padEnd(17," ").slice(0,17)} ${String(leaderboardData.tickets[property].tickets).padEnd(7," ")}`)
		}
	}
}

function ticketsLeaderboardUpdate() {
	db.ref(`users`).get().then((snapshot)=> {
		var userData = snapshot.val();
		var items = Object.keys(userData).map(function(key) {
			if (!(leaderboardData.tickets.exclusions.includes(key))) {
				return [key, userData[key].tickets];
			}
		});
		items.sort(function(first, second) {
			return second[1] - first[1];
		});	
		var top5 = items.slice(0,5);
		var newLeaderboardData = Object.fromEntries(
			top5.map((element,index)=>[index+1,{"tickets":element[1],username:userData[element[0]].username}])
		);
		newLeaderboardData.exclusions = leaderboardData.tickets.exclusions;
		leaderboardData.tickets = newLeaderboardData;
		db.ref(`leaderboards`).set(leaderboardData);
	});
}

function boostbar() {
	ctx = gameArea.context;
	ctx.fillStyle = "#272822";
	ctx.fillRect(
		gameArea.canvas.width / 2 - 50,
		gameArea.canvas.height - 30,
		100,
		20,
	);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(
		gameArea.canvas.width / 2 - 50,
		gameArea.canvas.height - 30,
		myPlayer.fuel,
		20,
	);
}

function miniMap() {
	ctx = gameArea.context;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(mini, Math.floor(gameArea.canvas.width - 218), 2, 200, 200);
	ctx.drawImage(
		playerPoint,
		Math.floor(gameArea.canvas.width - 218 - (myPlayer.x / 16000) * 200) - 5,
		Math.floor((-myPlayer.y / 16000) * 200) - 5,
		10,
		10,
	);
	ctx.drawImage(
		ticketImage,
		Math.floor(gameArea.canvas.width - 218 + (ticketX / 16000) * 200) - 5,
		Math.floor((ticketY / 16000)*200)-5,
		10,
		10,
	);
	/*for (let i = 0; i < 20; i++) {
		ctx.drawImage(
			jerryCanIconImage,
			Math.floor(gameArea.canvas.width - 218 + (jerryCans[i][0] / 16000) * 200) - 5,
			Math.floor((jerryCans[i][1] / 16000) * 200) - 7,
			10,
			10,
		)
	}*/
}

function towers() {
	ctx = gameArea.context;
	drawImageAtFixedPosition(towersImg,6450,2276,530,970)
}

function interact() {
	if (playerCollisionCheck(12249, 13049, 3249, 4049)) {
		db.ref("clicks").transaction((currentCount) => {
			return (currentCount || 0) + 1;
		});
		btn.src = "bClicked.png";
		setTimeout(function () {
			btn.src = "bUnclicked.png";
		}, 50);
	} 
	else if (playerCollisionCheck(10722+70, 10722+440, 3471+180, 3471+255) && diceRoll == null) {
		db.ref(`users/${myPlayer.id}/tickets`).once('value').then((snapshot) => {
			db.ref(`users/${myPlayer.id}/`).update({
				tickets: snapshot.val()-1
			});	
		});
		diceRoll = setInterval(() => {
			dieNum1 += 1
			dieNum2 += 1
			if (dieNum1 == 7) { dieNum1 = 1}
			if (dieNum2 == 7) { dieNum2 = 1}
			//drawImageAtFixedPosition(diceImages[dieNum1-1],10722+70,3471+15,135,135);
			//drawImageAtFixedPosition(diceImages[dieNum2-1],10722+295,3471+15,135,135);	

		},100);
		setTimeout(() => {
			clearInterval(diceRoll);
			dieNum1 = Math.floor(Math.random()*6)+1
			let win = (Math.floor(Math.random() * 20)+1 == 1)
			if (win) {
				dieNum2 = 7 - dieNum1;
				dialogue("YOU WON! Well done! You got 10 tickets!",false,0)
				db.ref(`users/${myPlayer.id}/tickets`).once('value').then((snapshot) => {
					db.ref(`users/${myPlayer.id}/`).update({
						tickets: snapshot.val()+10
					});	
				});
			}
			else {
				dieNum2 = Math.floor(Math.random()*6)+1
				while (dieNum2 == 7 - dieNum1) {
					dieNum2 = Math.floor(Math.random()*6)+1
				}
			}
			diceRoll = null;
		},1000)
	} else if (playerCollisionCheck(2116+16*4,2116+74*4,5129+22*4,5129+40*4)) {
		if (daysSinceEpoch() > lastJumbleSolve) {
			dialogue("Guess:", true, 0);
			dialoguePromptUse = "jumble";
			lastJumbleSolve = daysSinceEpoch();
			db.ref(`lastJumbleSolve/${myPlayer.id}/`).update({
				lastJumbleSolve,
			});
		} else {
			dialogue("You can only try once per day! Come back tommorow!",false,10000)
		}
	} else if (playerCollisionCheck(4950,5260,5010,5120)) {
		if (isPlayingWAJ) {
			dialogue("You are currently playing, go Whack James!",false,5000)
		}
		else {
			isPlayingWAJ = true
			dialogue("Lets Whack James! Hover over James and press Space",false,0)
			db.ref(`users/${myPlayer.id}/tickets`).once('value').then((snapshot) => {
				db.ref(`users/${myPlayer.id}/`).update({
					tickets: snapshot.val()-1
				});	
			});
			WAJtime = 60;
			WAJscore = 0;
			let timerTracker = setInterval(() => {
				WAJtime -= 1;
			},1000)
			setTimeout(() => {
				clearInterval(timerTracker);
				let ticketsEarnt = Math.ceil(Math.pow(1.5,WAJscore/10)-1);
				dialogue(`You scored ${WAJscore}, you earnt ${ticketsEarnt}`,false,0)
				WAJtime = 60;
				tickets = tickets + ticketsEarnt
				db.ref(`users/${myPlayer.id}`).update({
					tickets,
				});
				isPlayingWAJ = false;
			},60000)
		}
	} else if (playerCollisionCheck(4460,4934.4,5010,5447.1)) {
		if (isPlayingWAJ) {
			let attackedLocation = [0,0];
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (playerCollisionCheck(4460+i*159.8,4460+(i+1)*159.8,5010+j*145.7,5010+(j+1)*145.7)) {
						attackedLocation = [i,j];
					}
				}
			}
			let target = whackAJamesLayout[attackedLocation[0]][attackedLocation[1]];
			if (target == "jamesSadImg") {
				WAJscore += 1;
				whackAJamesLayout[attackedLocation[0]][attackedLocation[1]] = "windowShutImg";
				whackAJamesLayout[Math.floor(Math.random()*3)][Math.floor(Math.random()*3)] = "jamesSadImg";
			}
		}
	} else if (playerCollisionCheck(2200,2200+310,1756,1756+110)) {
		if (isPlayingFP) {
			dialogue("You are already playing Flappy Plane",false,0);
		} else {
			isPlayingFP = true;
			dialogue("Lets play Flappy Plane!",false,0)
			db.ref(`users/${myPlayer.id}/tickets`).once('value').then((snapshot) => {
				db.ref(`users/${myPlayer.id}/`).update({
					tickets: snapshot.val()-1
				});	
			});
			FPpoints = 0;
			let pipesSpawned = 0;
			pipeSpawner = setInterval(() => {
				FPpipeLocations.push([22,Math.floor(Math.random()*(256-16-24-16-24))+16+24])
				pipesSpawned += 1;
				if (pipesSpawned == 4) {
					clearInterval(pipeSpawner);
				}
			},256/60*1000);
		}
	} else if (playerCollisionCheck(2200+310,2200+310+310,1756,1756+110)) {
		if (isPlayingFP) {
			FPspeed = 2.5;
		} else {
			dialogue("You need to start playing before using this button!",false,0);
		}
	} else if (playerCollisionCheck(12300,12300+400,6100,6100+400)) {
		if ((Date.now() - lastBananaClick) > 1000) { 
			bananaClickerData.bananas += 1;
			db.ref(`bananaClicker/${myPlayer.id}`).update(bananaClickerData);
			lastBananaClick = Date.now();
		}
	} else {

		if (myPlayer.fuel > 1.5) {
			myPlayer.fuel -= 1.5;
			myPlayer.acceleration = 10;
			db.ref(`users/${myPlayer.id}`).update({
				fuel: myPlayer.fuel
			});
		}
	}
}

function playerCollisionCheck(a, b, c, d) {
	return (
		a + myPlayer.x + gameArea.canvas.width / 2 <
		gameArea.canvas.width / 2 &&
		b + myPlayer.x + gameArea.canvas.width / 2 >
		gameArea.canvas.width / 2 &&
		c + myPlayer.y + gameArea.canvas.height / 2 <
		gameArea.canvas.height / 2 &&
		d + myPlayer.y + gameArea.canvas.height / 2 > gameArea.canvas.height / 2
	);
}

function sendPlayerToDB(player) {
	// Use the player's ID instead of the push() method
	playersRef.child(player.id).set(player);
}

function fetchPlayer(playerName) {
	for (fPl of players) {
		if (fPl.username == playerName) {
			return fPl;
		}
	}
	return null;
}


function jerryCansDraw() {
	for (var i = 0; i < 20; i++) {
		drawImageAtFixedPosition(jerryCanImage,jerryCans[i][0]-31,jerryCans[i][1]-31,62,62);
		if (Math.abs(myPlayer.x+jerryCans[i][0])<=30 && Math.abs(myPlayer.y+jerryCans[i][1])<=30) {
			if (myPlayer.fuel >= 80) {
				myPlayer.fuel = 100;
			}
			else {
				myPlayer.fuel += 20;
			}
			db.ref(`users/${myPlayer.id}`).update({
				fuel: myPlayer.fuel
			});
			jerryCans[i] = [Math.floor(Math.random()*14000),Math.floor(Math.random()*14000)]
			db.ref(`jerryCans/${i+1}`).update({
				x: jerryCans[i][0],
				y: jerryCans[i][1],
			});
		}
	}
}

function ticketDraw() {
	if (Math.abs(myPlayer.x+ticketX) <= 250 && Math.abs(myPlayer.y+ticketY) <= 140) {
		dialogue("You got the ticket! Well done!",false,0)
		tickets = tickets + 1
		db.ref(`users/${myPlayer.id}`).update({
			tickets,
		});
		ticketX = Math.floor(Math.random()*14000);
		ticketY = Math.floor(Math.random()*14000);
		db.ref(`/`).update({
			presentX:ticketX,
			presentY:ticketY
		});
	}
	let highestV = 0.1
	let ticketPlayer = 0
	for (const player in players) {
		var playerVelocity = Math.sqrt(players[player]["vx"]**2+players[player]["vy"]**2)
		if (playerVelocity > highestV) {
			highestV = playerVelocity
			ticketPlayer = players[player].id
		}
	}
	if (ticketPlayer == myPlayer.id) {
		let runVector = [0,0]
		for (const player in players) {
			runVector = [runVector[0]+ticketX+players[player].x,runVector[1]+ticketY+players[player].y]
		}
		if (ticketX < 8000) {
			runVector[0] = runVector[0] - ticketX*5 + 8000*5
		}
		else {
			runVector[0] = runVector[0] + ticketX*5 - 8000*5
		}
		if (ticketY < 8000) {
			runVector[1] = runVector[1] - ticketY*5 + 8000*5
		}
		else {
			runVector[1] = runVector[1] + ticketY*5 - 8000*5
		}
		let runAngle = Math.atan2(runVector[1],runVector[0]) + Math.PI / 2
		ticketX += Math.cos(runAngle - Math.PI / 2) * 45;
		ticketY += Math.sin(runAngle - Math.PI / 2) * 45;
		if (ticketX < 0) { ticketX += 16000 }
		if (ticketX > 16000) { ticketX -= 16000 }
		if (ticketY < 0) { ticketY += 16000 }
		if (ticketY > 16000) { ticketY -= 16000 }
		db.ref(`/`).update({
			presentX:ticketX,
			presentY:ticketY,
		})

	}
	drawImageAtFixedPosition(ticketImage,ticketX-125,ticketY-70,250,140)
}

function isValidCommand(cmd) {
	let cmdArgs = cmd.split(" ")
	if (cmdArgs[0] == "kill") {
		if (cmdArgs[1] == "frazeldazel" || cmdArgs[1] == "johnnyairlinesceo" || cmdArgs[1] == "hmmmm") {
			return false;
		}
		let unames = []
		for (let player in players) {
			unames.push(players[player]["username"])
		}
		if ((unames.includes(cmdArgs[1]) && cmdArgs[1] != "frazeldazel" && cmdArgs[1] != "johnnyairlinesceo" || cmdArgs[1] == "hmmmm") || (cmdArgs[1] == "all" && cmdArgs[0]=="kill")) {
			return true;
		}
	}
	if (cmdArgs[0] == "prison" || cmdArgs[0] == "release" || cmdArgs[0] == "sendMessage" || cmdArgs[0] == "boostSet" || cmdArgs[0] == "ticketSet" || cmdArgs[0] == "help" || cmdArgs[0] == "sendPrompt" || cmdArgs[0] == "tp") {
		return true;
	}
	return false;
}

function executeCommand(cmdId, cmd) {
	let cmdArgs = cmd.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(s => s.replace(/^"|"$/g, ""));
	if (cmdArgs[1] == "all" && myPlayer.username != "frazeldazel" && myPlayer.username != "johnnyairlinesceo" && myPlayer.username != "hmmmm") {
		if (cmdArgs[0] == "kill") {
			myPlayer.x = 20000
			db.ref(`cmds/${cmdId}`).remove()
		}
		if (cmdArgs[0] == "sendMessage") {
			dialogue(cmdArgs[2],false,0);
			db.ref(`cmds/${cmdId}`).remove();	
		}
	}
	if (cmdArgs[0] == "help" && (myPlayer.username == "frazeldazel" || myPlayer.username == "johnnyairlinesceo" || myPlayer.username == "hmmmm")) {
		myPlayer.x = -4000000;
		db.ref(`cmds/${cmdId}`).remove();
	}
	if (cmdArgs[1] == myPlayer.username) {
		if (cmdArgs[0] == "tp") {
			console.log(cmdArgs)
			myPlayer.x = parseInt(cmdArgs[2])
			myPlayer.y = parseInt(cmdArgs[3])
			db.ref(`cmds/${cmdId}`).remove()
		}
		if (cmdArgs[0] == "kill") {
			myPlayer.x = 20000
			db.ref(`cmds/${cmdId}`).remove()
		}
		if (cmdArgs[0] == "prison") {
			myPlayer.x = -2656
			myPlayer.y = -13312
			myPlayer.fuel = 0
			prisonCmdId = cmdId
			db.ref(`users/${myPlayer.id}`).update({
				fuel: myPlayer.fuel
			});
		}
		if (cmdArgs[0] == "release") {
			myPlayer.x = -8000
			myPlayer.y = -8000
			db.ref(`cmds/${prisonCmdId}`).remove()
			db.ref(`cmds/${cmdId}`).remove()
			prisonCmdId = "N/A"
		}
		if (cmdArgs[0] == "sendMessage") {
			dialogue(cmdArgs[2],false,0);
			db.ref(`cmds/${cmdId}`).remove();
		}
		if (cmdArgs[0] == "sendPrompt") {
			dialogue(cmdArgs[2],true,0);
			dialoguePromptUse = "sendPromptCMD"
			db.ref(`cmds/${cmdId}`).remove();
		}
		if (cmdArgs[0] == "boostSet") {
			myPlayer.fuel = parseFloat(cmdArgs[2]);
			db.ref(`users/${myPlayer.id}`).update({
				fuel: myPlayer.fuel
			});
			db.ref(`cmds/${cmdId}`).remove();
		}
		if (cmdArgs[0] == "ticketSet") {
			tickets = parseFloat(cmdArgs[2]);
			db.ref(`users/${myPlayer.id}`).update({
				tickets: tickets
			});
			db.ref(`cmds/${cmdId}`).remove();
		}
	}
}

function prison() {
	ctx = gameArea.context
	ctx.fillStyle = "#000000"
	//center 2656, 13312
	if (playerCollisionCheck(2400, 2912, 13056, 13088) || playerCollisionCheck(2400, 2432, 13056, 13568) || playerCollisionCheck(2880, 2912, 13056, 13568) || playerCollisionCheck(2400, 2912, 13536, 13568)) {
		myPlayer.vx *= -0.5
		myPlayer.vy *= -0.5
		myPlayer.x = safeX
		myPlayer.y = safeY
	}
	else {
		safeX = myPlayer.x
		safeY = myPlayer.y
	}
}

function gambling() {
	ctx = gameArea.context;
	ctx.fillStyle = "#000000";
	drawImageAtFixedPosition(gambleImg,10722,3471,500,500);
	drawImageAtFixedPosition(diceImages[dieNum1-1],10722+70,3471+15,135,135);
	drawImageAtFixedPosition(diceImages[dieNum2-1],10722+295,3471+15,135,135);	
}

function jumble() {
	ctx = gameArea.context;
	ctx.fillStyle = "#000000";
	ctx.font = "32px DEFAULT FONT";
	ctx.textAlign = "center";
	drawImageAtFixedPosition(jumbleImg,2116,5129,360,360);
	jumbleData.scramble[Symbol.iterator]().forEach((letter, index) => {
		ctx.fillText(letter, 2116 + 37 + 48 * index + myPlayer.x + gameArea.canvas.width / 2, 5129 + 24 + 22 + myPlayer.y + gameArea.canvas.height / 2);
	});

}

function whackAJames() {
	ctx = gameArea.context;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (whackAJamesLayout[i][j] == "jamesSadImg" || whackAJamesLayout[i][j] == "jamesHappyImg") {
				drawImageAtFixedPosition(windowOpenImg,4460+i*159.8,5010+j*145.7,159.8,145.7);
				drawImageAtFixedPosition(eval(whackAJamesLayout[i][j]),4460+i*159.8+20,5010+j*145.7+5,79.5*1.5,88.7*1.5);
			} else {
				drawImageAtFixedPosition(windowShutImg,4460+i*159.8,5010+j*145.7,159.8,145.7);
			}
		}
	}
	ctx.fillStyle = "#000000";
	ctx.fillRect(
		4950+myPlayer.x+gameArea.canvas.width/2,
		5010+myPlayer.y+gameArea.canvas.height/2,
		310,
		110,
	)
	ctx.fillStyle = "#2f3699";
	ctx.fillRect(
		4955+myPlayer.x+gameArea.canvas.width/2,
		5015+myPlayer.y+gameArea.canvas.height/2,
		300,
		100,
	)
	ctx.font = "64px DEFAULT FONT";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("PLAY",4955+152+myPlayer.x+gameArea.canvas.width/2,5015+64+myPlayer.y+gameArea.canvas.height/2)
	ctx.textAlign = "left"
	ctx.font = "24px DEFAULT FONT";
	let texts = ["Whack a James","Costs 1 Ticket per Attempt","Hit James to earn points", "Points translate into tickets", "60 secs to get as many points as possible","",`Points: ${WAJscore}`,`Time remaining: ${WAJtime}`]
	for (let i = 0; i < 8; i++) {
		ctx.fillText(texts[i],4955+myPlayer.x+gameArea.canvas.width/2,5140+24*i+myPlayer.y+gameArea.canvas.height/2)
	}
}

function pipeDraw(pipeX,pipeY,pipeGap) {
	ctx = gameArea.context;
	pipeX += 11*4/2;
	ctx.drawImage(
		pipeImg,
		0, 0,
		11, pipeY/4 - pipeGap/2,
		2200+1024-pipeX + myPlayer.x + gameArea.canvas.width / 2,
		1500+256-pipeY+pipeGap*4/2 + myPlayer.y + gameArea.canvas.height / 2,
		11*4,
		(pipeY/4 - pipeGap/2)*4,
	);
	ctx.save();
	ctx.scale(1,-1);
	ctx.drawImage(
		pipeImg,
		0, 0,
		11, 256/4 - (pipeY/4 + pipeGap/2),
		2200+1024-pipeX + myPlayer.x + gameArea.canvas.width / 2,
		-(1500+256-pipeY-pipeGap*4/2 + myPlayer.y + gameArea.canvas.height / 2),
		11*4,
		(256/4 - (pipeY/4 + pipeGap/2))*4,
	);
	ctx.restore();
}

function flappyPlaneDraw() {
	ctx = gameArea.context;
	ctx.fillStyle = "#000000";
	ctx.fillRect(
		2200+myPlayer.x+gameArea.canvas.width/2,
		1756+myPlayer.y+gameArea.canvas.height/2,
		310,
		110,
	)
	ctx.fillStyle = "#2f3699";
	ctx.fillRect(
		2205+myPlayer.x+gameArea.canvas.width/2,
		1761+myPlayer.y+gameArea.canvas.height/2,
		300,
		100,
	)
	ctx.font = "64px DEFAULT FONT";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("PLAY",2200+152+myPlayer.x+gameArea.canvas.width/2,1756+64+myPlayer.y+gameArea.canvas.height/2)
	ctx.fillStyle = "#000000";
	ctx.fillRect(
		2200+310+myPlayer.x+gameArea.canvas.width/2,
		1756+myPlayer.y+gameArea.canvas.height/2,
		310,
		110,
	)
	ctx.fillStyle = "#2f3699";
	ctx.fillRect(
		2205+310+myPlayer.x+gameArea.canvas.width/2,
		1761+myPlayer.y+gameArea.canvas.height/2,
		300,
		100,
	)
	ctx.font = "64px DEFAULT FONT";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("UP",2200+152+310+myPlayer.x+gameArea.canvas.width/2,1756+64+myPlayer.y+gameArea.canvas.height/2)
	ctx.textAlign = "left"
	ctx.font = "24px DEFAULT FONT";
	let texts = ["Flappy Plane","Cost: 1 ticket", `Points: ${FPpoints}`];
	for (let i = 0; i < 3; i++) {
		ctx.fillText(texts[i],2200+310*2+myPlayer.x+gameArea.canvas.width/2,1756+24+24*i+myPlayer.y+gameArea.canvas.height/2)
	}
	if (isPlayingFP) {
		FPbgLocation = FPbgLocation + 0.255;
	}
	const sx = FPbgLocation % 256;
	const cropWidth = Math.min(256,256-sx);
	ctx.save();
	ctx.scale(4,4);
	ctx.drawImage(
		skylineImg,
		sx, 0,
		cropWidth, 64,
		(2200 + myPlayer.x + gameArea.canvas.width / 2)/4,
		(1500 + myPlayer.y + gameArea.canvas.height / 2)/4,
		cropWidth, 64
	)
	if (cropWidth < 256) {
		ctx.drawImage(
			skylineImg,
			0, 0,
			256 - cropWidth, 64,
			cropWidth + (2200 + myPlayer.x + gameArea.canvas.width / 2)/4,
			(1500 + myPlayer.y + gameArea.canvas.height / 2)/4,
			256 - cropWidth, 64
		)
	}
	ctx.restore();
	drawImageAtFixedPosition(FPImg,2200+96,1500+256-FPheight-17,36*2,17*2);
	if (isPlayingFP) {
		FPheight += FPspeed;
		FPspeed -= 0.075;
	}
	FPpipeLocations.forEach((pipeData,index) => {
		pipeDraw(pipeData[0],pipeData[1],24);
		if (isPlayingFP) {
			FPpipeLocations[index][0] += 2;
			if (pipeData[0] > (1024-11*2)) {
				FPpipeLocations[index][0] -= (1024-11*4);
				FPpipeLocations[index][1] = Math.floor(Math.random()*(256-16-24-16-24))+16+24
				FPpoints += 1;
			}
			if (((Math.abs(pipeData[1]-FPheight) > 12+17*2) && (Math.abs((1024-96-36)-pipeData[0]) < 36+11*2)) || FPheight < 0 || FPheight > 256) {
				isPlayingFP = false;
				FPpipeLocations = [];
				FPheight = 128;
				FPspeed = 0;
				clearInterval(pipeSpawner);
				let ticketsEarnt = Math.round(Math.pow(1.5,FPpoints/10)-1);
				dialogue(`You scored ${FPpoints}, you earnt ${ticketsEarnt}`,false,0);
				tickets = tickets + ticketsEarnt
				db.ref(`users/${myPlayer.id}`).update({
					tickets,
				});
			}
		}
	});
}

function bananaClickerDraw() {
	ctx = gameArea.context;
	drawImageAtFixedPosition(bananaImg,12300,6100,400,400);
	ctx.font = "128px DEFAULT FONT";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText(bananaClickerData.bananas,12500+myPlayer.x+gameArea.canvas.width/2,6500+128+myPlayer.y+gameArea.canvas.height/2)
};

function cloudsDraw() {
	if (cloudsOn) {
		ctx = gameArea.context;
		ctx.globalAlpha = 0.4;
		drawImageAtFixedPosition(cloudsImg, cloudPos[0]-16000, cloudPos[1]-16000, 32000, 32000);
		ctx.globalAlpha = 1;
		cloudPos[0] += cloudDirection[0];
		cloudPos[1] += cloudDirection[1];
		if (cloudPos[0] > 16000) {
			cloudPos[0] -= 16000;
		} else if (cloudPos[0] < 0) {
			cloudPos[0] += 16000;
		} else if (cloudPos[1] > 16000) {
			cloudPos[1] -= 16000;
		} else if (cloudPos[1] < 0) {
			cloudPos[1] += 16000
		}
	}
}

function pvp() {
	ctx = gameArea.context
	let pvpOn = playerCollisionCheck(8336,15680,10048,15776)
	if (pvpOn) {
		ctx.beginPath();
		ctx.arc(gameArea.canvas.width-130 , 300 , 75 , 0 , 2*Math.PI );
		ctx.strokeStyle = "#555555";
		ctx.lineWidth = 13;
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(gameArea.canvas.width-130 , 300 , 75 , Math.PI*3/2 , Math.PI*3/2+myPlayer.health*Math.PI*2/100 );
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 8;
		ctx.stroke();

		ctx.drawImage(heartImage,gameArea.canvas.width-182,250,110,90);
	}
	bullets.forEach((bullet) => {
		bullet.draw()
		if (bullet.player == myPlayer.id) {
			bullet.update();
		}
		else if (Math.sqrt((bullet.x-myPlayer.x)**2 + (bullet.y-myPlayer.y)**2) < 100 && pvpOn) {
			db.ref(`/bullets/${bullet.key}`).remove().then(()=>{
				if (bullet.isRocket) {
					myPlayer.health -= 10
					console.log("huh")
				} else {
					myPlayer.health -= 3
				}
				if (myPlayer.health <= 0) {
					db.ref(`users/${myPlayer.id}/tickets`).once('value', (snapshot) => {
						if (snapshot.val() > 0) {
							db.ref(`users/${bullet.player}/tickets`).once('value', (snapshot2) => {
								db.ref(`users/${bullet.player}/`).update({
									tickets: snapshot2.val()+1
								});
							}).then(()=>{
								db.ref(`users/${myPlayer.id}/`).update({
									tickets: snapshot.val()-1
								});
								location.reload()
							});
						}
					})			
				}

			});
		}
	})
	bombs.forEach((bomb) => {
		bomb.update();
		bomb.draw();
		if (Math.sqrt((bomb.x-myPlayer.x)**2+(bomb.y-myPlayer.y)**2) < 78*2 && pvpOn && bomb.frame == 12) {
			myPlayer.health -= 10
			if (myPlayer.health <= 0) {
				db.ref(`users/${myPlayer.id}/tickets`).once('value', (snapshot) => {
					if (snapshot.val() > 0) {
						db.ref(`users/${bomb.player}/tickets`).once('value', (snapshot2) => {
							db.ref(`users/${bomb.player}/`).update({
								tickets: snapshot2.val()+1
							});
						}).then(()=>{
							db.ref(`users/${myPlayer.id}/`).update({
								tickets: snapshot.val()-1
							});
							location.reload()
						});
					}
				})	
			}
		}
	});
}

//Start Game
function startGame(displayName, email, uid, plane) {
	gameArea.start();
	gameArea.resize();
	myPlayer = new p();
	myPlayer.displayName = displayName;
	myPlayer.username = email;
	window.playerUsername = email;
	myPlayer.id = uid;
	myPlayer.x = -8000;
	myPlayer.y = -8000;
	db.ref(`users/${uid}/fuel`).once("value").then((snapshot) => {
		myPlayer.fuel = snapshot.val();
	});
	myPlayer.plane = plane;
	if (planeData[plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].music != null) {
		myAudio.src = planeData[plane.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png","")].music
		myAudio.play()
	}
	db.ref(`users/${uid}/lastLogin`).set(Date.now());
	
	sendPlayerToDB(myPlayer);
	var userStatusDatabaseRef = db.ref(`/status/${uid}`)
	db.ref(`.info/connected`).on('value', (snapshot) => {
		if (snapshot.val() == false) {
			return;
		}
		userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
			userStatusDatabaseRef.set(isOnlineForDatabase);
		})
	})
	document.getElementById("pfp").src = plane;
	document.getElementById("dname").innerHTML = displayName;
	document.getElementById("uname").innerHTML = email;
	document.getElementById("overlaypfp").src = plane;
	document.getElementById("overlaydname").innerHTML = displayName;
	document.getElementById("overlayuname").innerHTML = email;
	db.ref("users/" + uid + "/tickets").on("value", (snapshot) => {
		document.getElementById("ticketDisplay").innerHTML =
			":" + snapshot.val();
		document.getElementById("overlayticketDisplay").innerHTML =
			":" + snapshot.val();
		tickets = snapshot.val();
		ticketsLeaderboardUpdate();
	});
	db.ref(`leaderboards`).once("value").then((snapshot) => {
		leaderboardData = snapshot.val();
	});
	db.ref(`leaderboards`).on("value", (snapshot) => {
		leaderboardData = snapshot.val();
	});
	db.ref(`bombs`).on("child_added", (snapshot) => {
		const bombData = snapshot.val();
		const bomb = new Bomb(
			bombData.x,
			bombData.y,
			bombData.frame,
			bombData.id,
			bombData.player
		);
		bombs.push(bomb);
	});
	db.ref(`bombs`).on("child_removed", (snapshot) => {
		const bombId = snapshot.key;
		bombs = bombs.filter((bomb) => bomb.id !== bombId);
	});
	db.ref(`bullets`).on("value", (snapshot) => {
		bullets = []
		if (snapshot.val() != null) {
			let bulletsData = Object.values(snapshot.val())
			bulletsData.forEach((bulletData)=>{
				const bullet = new Bullet(
					bulletData.x,
					bulletData.y,
					bulletData.angle,
					bulletData.player,
					bulletData.timestamp,
					bulletData.key,
					bulletData.isRocket
				);
				bullets.push(bullet);
			})
		}
	});
	db.ref(`presentX`).on("value", (snapshot) => {
		ticketX = snapshot.val();
	});
	db.ref(`presentY`).on("value", (snapshot) => {
		ticketY = snapshot.val();
	});
	db.ref(`cmds`).on("child_added", (snapshot) => {
		executeCommand(snapshot.key,snapshot.val().command)
	});
	db.ref(`jumble`).once("value").then((snapshot) => {
		jumbleData = snapshot.val();
		jumbleData.scramble = shuffle(jumbleData.currentJumble);
		if (daysSinceEpoch() > jumbleData.lastJumbleUpdate) {
			fetch('./words.json').then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json()
			}).then((data) => {
				db.ref(`jumble`).update({ 
					lastJumbleUpdate: daysSinceEpoch(),
					currentJumble: data.words[Math.floor(Math.random()*data.words.length)].toUpperCase(),
				});
			})
		}
	});
	db.ref(`jumble`).on("value", (snapshot) => {
		jumbleData = snapshot.val();
		jumbleData.scramble = shuffle(jumbleData.currentJumble);
	});
	db.ref(`lastJumbleSolve/${myPlayer.id}/lastJumbleSolve`).on("value", (snapshot) => {
		lastJumbleSolve = snapshot.val();
	});
	db.ref(`bananaClicker/${myPlayer.id}/`).once("value").then((snapshot) => {
		if (snapshot.val() == null) {
			db.ref(`bananaClicker/${myPlayer.id}/`).set({
				bananas: 0
			});
		} 
	});
	db.ref(`bananaClicker/${myPlayer.id}/`).on("value", (snapshot) => {
		bananaClickerData = snapshot.val();
	});
	db.ref(`noticeboard`).once("value").then((snapshot) => {
		noticeboardData = snapshot.val();
	});
	db.ref(`noticeboard`).on("value", (snapshot) => {
		noticeboardData = snapshot.val();
	});
	for (let i = 0; i < 20; i++) {
		db.ref(`jerryCans/${i+1}/x`).on("value", (snapshot) => {
			jerryCans[i][0] = snapshot.val();
		});
		db.ref(`jerryCans/${i+1}/y`).on("value", (snapshot) => {
			jerryCans[i][1] = snapshot.val();
		});
	}

	playersRef.on("value", (snapshot) => {
		players = snapshot.val();
		for (const playerId in players) {
			let player = players[playerId];
			if (player.id != myPlayer.id) {
				const playerInstance = new p();
				Object.assign(playerInstance, player);
				db.ref(`/status/${player.id}`).once('value').then((snapshot) => {
					if (snapshot.val().state == "offline") {
						try {
							bullets.forEach((bullet)=>{
								if (bullet.player == player.id) {
									db.ref(`bullets/${bullet.key}`).remove();
								}
							})
						}
						catch (e) {
							console.log("huh")
						}

						db.ref(`players/${player.id}`).remove()
					}
				})
			}
		}
	});
	// Draw all players on the canvas

	updateGameArea(Date.now());
}


//Update Game Area
function updateGameArea(lastTimestamp) {
	let currentTime = Date.now()
	let fps = (1/((currentTime-lastTimestamp)/1000))

	if (isDialogueOpen) {
		dialogueDraw();
		if ((Date.now()-currentTime)<(1000/30)) {
			setTimeout(() => {
				updateGameArea(currentTime)
			}, (1000/30)-(Date.now()-currentTime));
			return;
		}
		else {
			updateGameArea(currentTime)
		}
	}
	if (joystickActive) {
		const dx = joystickTouch.x - joystickCenter.x;
		const dy = joystickTouch.y - joystickCenter.y;
		const distance = Math.hypot(dx, dy);

		if (distance > 5) { // deadzone
			const speed = myPlayer.acceleration;
			//myPlayer.vx -= (dx / joystickRadius) * speed;
			//myPlayer.vy -= (dy / joystickRadius) * speed;
		}
	}

	gameArea.clear();
	myPlayer.x += myPlayer.vx;
	myPlayer.y += myPlayer.vy;
	myPlayer.vy *= 0.96;
	myPlayer.vx *= 0.96;
	if (Math.abs(myPlayer.vx) < 0.1) {
		myPlayer.vx == 0;
	}
	if (Math.abs(myPlayer.vy) < 0.1) {
		myPlayer.vy == 0;
	}
	if (myPlayer.x + 16000 < 0) {
		myPlayer.x += 16000;
	}
	if (myPlayer.y + 16000 < 0) {
		myPlayer.y += 16000;
	}
	if (myPlayer.x < -200000) {
		window.location.href = "https://johnny-airlines.co.uk/cmdDocs.txt";
	}
	if (myPlayer.x > 2000) {
		window.location.replace("https://dn720407.ca.archive.org/0/items/rick-roll/Rick%20Roll.mp4");
	}
	if (myPlayer.x > 0) {
		myPlayer.x -= 16000;
	}
	if (myPlayer.y > 0) {
		myPlayer.y -= 16000;
	}
	if (myPlayer.acceleration > 2) {
		myPlayer.acceleration -= 1;
	}

	// Special shortcuts for special people
	if (!chatFocus && (myPlayer.id == "Q4QyRltsO8OdbvxrzlY16xfAw262" || myPlayer.id == "XSI66btuWOb4LWYkdfrmSUAa4KK2" || myPlayer.id == "c6UqdfQ5T4XE2092p0Eh5JPLuIy2")){
		if (keysPressed.includes("B")) {
			keysPressed.splice(keysPressed.indexOf("B"),1)
			myPlayer.vx *= 1.1;
			myPlayer.vy *= 1.1;
		}
		if (keysPressed.includes("C")) {
			keysPressed.splice(keysPressed.indexOf("C"),1)
			dialogue("Command: ", true, 0);
			dialoguePromptUse = "sendCommand";
		}
		keysPressed.splice(keysPressed.indexOf("Shift"),1)
	}

	cleanUpArray();
	if (mouseDown) {
		myPlayer.vx -= Math.cos(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
		myPlayer.vy -= Math.sin(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
		for (let i = 0; i < 20; i++) {
			particles.push(new Particle(-1 * myPlayer.x, -1 * myPlayer.y,myPlayer.contrailColour));
		}
	}
	
	if (leaderboardData != null) {
		if (myPlayer.username == leaderboardData.tickets[1].username) {
			myPlayer.contrailColour = "rainbow";
		} else {
			myPlayer.contrailColour = "default";
			if (myPlayer.id == "Q4QyRltsO8OdbvxrzlY16xfAw262") {
				myPlayer.contrailColour = "tristan"
			}
			if (myPlayer.id == "Bszj2Ziw1ffbD9J4gw32LlJtIEq2") {
				myPlayer.contrailColour = "tristan"
			}
		}
	}

	myPlayer.update();
	cloudsDraw();
	gameArea.context.font = "24px DEFAULT FONT"; 
	gameArea.context.fillText(`Fps: ${Math.round(fps)}`,gameArea.canvas.width/2,20);
	buttonDraw();
	ticketDraw();
	jerryCansDraw();
	towers();
	prison();
	frame();
	pvp();
	gambling();
	jumble();
	whackAJames();
	flappyPlaneDraw();
	bananaClickerDraw();
	noticeboard();
	leaderboardsDraw();


	myPlayer.planeDraw();
	boostbar();
	miniMap();
	sendPlayerToDB(myPlayer);

	for (const playerId in players) {
		let player = players[playerId];
		if (player.id != myPlayer.id) {
			const playerInstance = new p();
			Object.assign(playerInstance, player);
			playerInstance.draw();
			ctx = gameArea.context;
			ctx.drawImage(
				otherPlayerPoints,
				Math.floor(
					gameArea.canvas.width -
					218 -
					(playerInstance.x / 16000) * 200,
				) - 5,
				Math.floor((-playerInstance.y / 16000) * 200) - 7,
				10,
				10,
			);
			if (playerInstance.mouseDown) {
				for (let i = 0; i < 20; i++) {
					particles.push(
						new Particle(
							-1 * playerInstance.x,
							-1 * playerInstance.y,
							playerInstance.contrailColour,
						),
					);
				}
			}
		}

	}
	drawJoystick(ctx);
	if ((Date.now()-currentTime)<(1000/30)) {
		setTimeout(() => {
			updateGameArea(currentTime)
		}, (1000/30)-(Date.now()-currentTime));
	}
	else {
		updateGameArea(currentTime)
	}
}
})();

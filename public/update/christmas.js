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
			"Pixelify Sans",
			"url('./PixelFont.ttf')"
		);
		PixelFont.load().then((font) => {
			document.fonts.add(font)
			startGame(displayName, email, uid, photoURL);
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
	keysPressed.push(key.keyCode);
	keysPressed = [...new Set(keysPressed)];
	for (let k in keysPressed) {
		if (keysPressed[k] == 32 && !chatFocus) {
			interact();
		}
		if (keysPressed[k] == 81 && !chatFocus && prisonCmdId == "N/A") {
			dropBomb();
		}
		if (keysPressed[k] == 69 && !chatFocus && prisonCmdId == "N/A") {
			shoot();
		}
		if (keysPressed[k] == 70 && !chatFocus && prisonCmdId == "N/A") {
			missileShoot();
		}
		if (keysPressed[k] == 191 && !chatFocus) {
			document.getElementById("message-input").focus();
			document.getElementById("message-input").select();
		}
		if (keysPressed[k] == 13) {
			document.getElementById("message-btn").click();
		}
		if (keysPressed[k] == 80 && !chatFocus) {
			mouseDown = 0;
			myPlayer.mouseDown = false;
		}
	}
});
document.addEventListener("keyup", (key) => {
	keysPressed = keysPressed.filter((item) => item !== key.keyCode);
});
//Mousemove detection
onmousemove = function (e) {
	var diffX = e.clientX - gameArea.canvas.width / 2;
	var diffY = e.clientY - gameArea.canvas.height / 2;
	myPlayer.angle = Math.atan2(diffY, diffX) + Math.PI / 2;
};
//Mousedown detection
let mouseDown = 0;
const myAudio = document.createElement("audio");
myAudio.src = "../island.mp3";
window.onmousedown = (e) => {
	++mouseDown;
	++myPlayer.mouseDown;
	myAudio.play()
}
window.onmouseup = () => {
	--mouseDown;
	--myPlayer.mouseDown;
};



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
const speechBubbleImg = new Image();
speechBubbleImg.src = "../speechBubble.png";
const jerryCanImage = new Image();
jerryCanImage.src = "../jerryCan.png";
const jerryCanIconImage = new Image();
jerryCanIconImage.src = "../jerryCanIcon.png";
const coconutImage = new Image();
coconutImage.src = "../coconutSmall.png";
const coconutIconImage = new Image();
coconutIconImage.src = "../coconutSmall.png";
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
var coconuts = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]; 
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
var cloudPos = [8000,8000];
var cloudDirection = [Math.floor(Math.random()*10)-5,Math.floor(Math.random()*10)-5]

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
	colorVariation: 50,
};
var colorPalette = {
	bg: { r: 12, g: 9, b: 29 },
	matter: [
		{ r: 255, g: 0, b: 0 }, // darkPRPL
		{ r: 78, g: 36, b: 42 }, // rockDust
		{ r: 252, g: 178, b: 96 }, // solorFlare
		{ r: 253, g: 238, b: 152 }, // totesASun
	],
};
var particleEffect = true;
var particles = [],
	centerX = gameArea.canvas.width / 2,
	centerY = gameArea.canvas.height / 2,
	drawBg;
var Particle = function (x, y) {
	// X Coordinate
	this.x = x || 0;
	// Y Coordinate
	this.y = y || 0;
	// Radius of the space dust
	this.r = Math.ceil(Math.random() * particleConfig.maxParticleSize);
	// Color of the rock, given some randomness
	this.c = colorVariation(
		colorPalette.matter[
			Math.floor(Math.random() * colorPalette.matter.length)
		],
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
var colorVariation = function (color, returnString) {
	var r, g, b, a, variation;
	r = Math.round(
		Math.random() * particleConfig.colorVariation -
		particleConfig.colorVariation / 2 +
		color.r,
	);
	g = Math.round(
		Math.random() * particleConfig.colorVariation -
		particleConfig.colorVariation / 2 +
		color.g,
	);
	b = Math.round(
		Math.random() * particleConfig.colorVariation -
		particleConfig.colorVariation / 2 +
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
		ctx.font = "24px Pixelify Sans";
		ctx.textAlign = "center";
		ctx.fillStyle = "#00FFBA";
		ctx.fillText(
			this.displayName,
			gameArea.canvas.width / 2,
			gameArea.canvas.height / 2 - 35,
		);
		ctx.font = "12px Pixelify Sans";
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
		ctx.font = "24px Pixelify Sans";
		ctx.textAlign = "center";
		ctx.fillStyle = "#932121";
		ctx.fillText(
			this.displayName,
			-this.x + myPlayer.x + gameArea.canvas.width / 2,
			-this.y + myPlayer.y + gameArea.canvas.height / 2 - 35,
		);
		ctx.font = "12px Pixelify Sans";
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
	if ((Date.now() - lastShot) > 250) {
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

function updateDisplayName() {
	firebase
		.auth()
		.currentUser.updateProfile({
			displayName: prompt(""),
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
	ctx.font = "250px Pixelify Sans";
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
		Math.floor((-myPlayer.y / 16000) * 200) - 7,
		10,
		10,
	);
	ctx.drawImage(
		ticketImage,
		Math.floor(gameArea.canvas.width - 218 + (ticketX / 16000) * 200) - 5,
		Math.floor((ticketY / 16000)*200)-7,
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
		for (let i = 0; i < 6; i++) {
			ctx.drawImage(
				coconutIconImage,
				Math.floor(gameArea.canvas.width - 218 + (coconuts[i][0] / 16000) * 200) - 5,
				Math.floor((coconuts[i][1] / 16000) * 200) - 7,
				10,
				10,
			)
		}
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
			let guess = prompt("Guess: ")
			if (guess.toUpperCase() == jumbleData.currentJumble) {
				tickets = tickets + 5
				db.ref(`users/${myPlayer.id}`).update({
					tickets,
				});
				alert("Correct, you get 5 tickets, come back again tommorow!")
			} else {
				alert("WRONG. Try again tommorow!")
			}
			lastJumbleSolve = daysSinceEpoch();
			db.ref(`lastJumbleSolve/${myPlayer.id}/`).update({
				lastJumbleSolve,
			});
		} else {
			alert("You can only try once per day! Come back tommorow");
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

function coconutsDraw() {
	for (var i = 0; i < 6; i++) {
		drawImageAtFixedPosition(coconutImage,coconuts[i][0]-31,coconuts[i][1]-31,62,62);
		if (Math.abs(myPlayer.x+coconuts[i][0])<=30 && Math.abs(myPlayer.y+coconuts[i][1])<=30) {
			let randoThing = Math.floor(Math.random()*500)
			if (randoThing == 1) {
				alert("You found the rare coconut plane! Refresh and then check the shop")
				db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
					var ownedPlanes = snapshot.val();
					ownedPlanes.push("coconut")
					db.ref(`/users/${firebase.auth().currentUser.uid}/`).update({
						ownedPlanes: ownedPlanes,
					})
				});
			}
			else if (randoThing < 375) {
				alert("You found a ticket!")
				tickets = tickets + 1
				db.ref(`users/${myPlayer.id}`).update({
					tickets,
				});
			}
			else {
				alert("Aww man, this coconut has nothing in it.")
			}
			coconuts[i] = [Math.floor(Math.random()*14000),Math.floor(Math.random()*14000)]
			db.ref(`coconuts/${i+1}`).update({
				x: coconuts[i][0],
				y: coconuts[i][1],
			});
		}
	}
}

function ticketDraw() {
	if (Math.abs(myPlayer.x+ticketX) <= 40 && Math.abs(myPlayer.y+ticketY) <= 46) {
		//alert("You found a ticket!")
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
	if (cmdArgs[0] == "tp" || cmdArgs[0] == "kill") {
		if (cmdArgs[1] == "frazeldazel" || cmdArgs[1] == "johnnyairlinesceo") {
			return false;
		}
		let unames = []
		for (let player in players) {
			unames.push(players[player]["username"])
		}
		if (unames.includes(cmdArgs[1]) && cmdArgs[1] != "frazeldazel" && cmdArgs[1] != "johnnyairlinesceo") {
			return true;
		}
	}
	if (cmdArgs[0] == "prison" || cmdArgs[0] == "release") {
		return true;
	}
	return false;
}

function executeCommand(cmdId, cmd) {
	let cmdArgs = cmd.split(" ")
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
	ctx.font = "32px Pixelify Sans";
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
	ctx.font = "64px Pixelify Sans";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.fillText("PLAY",4955+152+myPlayer.x+gameArea.canvas.width/2,5015+64+myPlayer.y+gameArea.canvas.height/2)
	ctx.textAlign = "left"
	ctx.font = "24px Pixelify Sans";
	let texts = ["Whack a James","Costs 1 Ticket per Attempt","Hit James to earn points", "Points translate into tickets", "60 secs to get as many points as possible","NON FUNCTIONAL, however is coming soon"]
	for (let i = 0; i < 6; i++) {
		ctx.fillText(texts[i],4955+myPlayer.x+gameArea.canvas.width/2,5140+24*i+myPlayer.y+gameArea.canvas.height/2)
	}
}
function cloudsDraw() {
	ctx = gameArea.context;
	ctx.globalAlpha = 0.4;
	drawImageAtFixedPosition(cloudsImg, cloudPos[0]-16000, cloudPos[1]-16000, 32000, 32000);
	ctx.globalAlpha = 1;
	cloudPos[0] += cloudDirection[0];
	cloudPos[1] += cloudDirection[1];
	if (cloudPos[0] > 16000) {
		cloudPos -= 16000;
	} else if (cloudPos[0] < 0) {
		cloudPos[0] += 16000;
	} else if (cloudPos[1] > 16000) {
		cloudPos[1] -= 16000;
	} else if (cloudPos[1] < 0) {
		cloudPos[1] += 16000
	}
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
	for (let i = 0; i < 20; i++) {
		db.ref(`jerryCans/${i+1}/x`).on("value", (snapshot) => {
			jerryCans[i][0] = snapshot.val();
		});
		db.ref(`jerryCans/${i+1}/y`).on("value", (snapshot) => {
			jerryCans[i][1] = snapshot.val();
		});
	}
	for (let i = 0; i < 6; i++) {
		db.ref(`coconuts/${i+1}/x`).on("value", (snapshot) => {
			coconuts[i][0] = snapshot.val();
		});
		db.ref(`coconuts/${i+1}/y`).on("value", (snapshot) => {
			coconuts[i][1] = snapshot.val();
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

function summerEventWelcomeText() {
	ctx = gameArea.context
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";
	ctx.font = "24px Pixelify Sans";
	ctx.fillText(
		"Welcome to the summer event, chill to some summer vibes,",
		8050 + myPlayer.x + gameArea.canvas.width / 2,
		8000 + myPlayer.y + gameArea.canvas.height / 2,
	);
	ctx.fillText(
		"collect coconuts for tickets",
		8050 + myPlayer.x + gameArea.canvas.width / 2,
		8024 + myPlayer.y + gameArea.canvas.height / 2,
	);
	ctx.fillText(
		"and perhaps find the new rare plane in a coconut.",
		8050 + myPlayer.x + gameArea.canvas.width / 2,
		8048 + myPlayer.y + gameArea.canvas.height / 2,
	);

}

//Update Game Area
function updateGameArea(lastTimestamp) {
	let currentTime = Date.now()
	let fps = (1/((currentTime-lastTimestamp)/1000))

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
	if (myPlayer.x > 2000) {
		window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
	if (keysPressed.includes(16) && !chatFocus && (myPlayer.id == "Q4QyRltsO8OdbvxrzlY16xfAw262" || myPlayer.id == "XSI66btuWOb4LWYkdfrmSUAa4KK2")){
		if (keysPressed.includes(66)) {
			myPlayer.vx *= 1.1;
			myPlayer.vy *= 1.1;
		}
		if (keysPressed.includes(67)) {
			keysPressed.splice(keysPressed.indexOf(67),1)
			let command = prompt("Command: ")
			if (isValidCommand(command)) {
				db.ref(`cmds`).push({
					command,
				});
			} else {
				alert("Invalid command")
			}
		}
	}

	cleanUpArray();
	if (mouseDown) {
		myPlayer.vx -= Math.cos(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
		myPlayer.vy -= Math.sin(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
		for (let i = 0; i < 20; i++) {
			particles.push(new Particle(-1 * myPlayer.x, -1 * myPlayer.y));
		}
	}
	
	myPlayer.update();
	cloudsDraw();
	gameArea.context.font = "24px Pixelify Sans"; 
	gameArea.context.fillText(`Fps: ${Math.round(fps)}`,gameArea.canvas.width/2,20);
	buttonDraw();
	ticketDraw();
	jerryCansDraw();
	coconutsDraw();
	towers();
	prison();
	frame();
	pvp();
	gambling();
	jumble();
	whackAJames();
	summerEventWelcomeText();


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
				particles.push(
					new Particle(
						-1 * playerInstance.x,
						-1 * playerInstance.y,
					),
				);
			}
		}

	}

	//cloudsDraw();

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

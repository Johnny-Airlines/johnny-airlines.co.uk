//Firebse Initialize
const firebaseConfig = {
    apiKey: "AIzaSyDEr38pIOpNXbqxC0OG2vlhSr-yGXyWnQw",
    authDomain: "johnny-airlines-b02a8.firebaseapp.com",
    projectId: "johnny-airlines-b02a8",
    storageBucket: "johnny-airlines-b02a8.appspot.com",
    messagingSenderId: "129767102004",
    appId: "1:129767102004:web:35c8b0b6b728970a0ddc61",
    measurementId: "G-N9369YGKL8",
};
firebase.initializeApp(firebaseConfig);

//Databse refrences
const db = firebase.database();
const playersRef = db.ref("players");

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
        startGame(displayName, email, uid, photoURL);
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
//Key detection
let keysPressed = [];
document.addEventListener("keydown", (key) => {
    keysPressed.push(key.keyCode);
    keysPressed = [...new Set(keysPressed)];
    for (k in keysPressed) {
        if (keysPressed[k] == 32) {
            interact();
        }
        if (keysPressed[k] == 81) {
            dropBomb();
        }
        if (keysPressed[k] == 69) {
            shoot();
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
window.onmousedown = (e) => {
    ++mouseDown;
    ++myPlayer.mouseDown;
};
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
//Other Variables
let ctx;
var myPlayer;
let players = [];
let bombs = [];
let bullets = [];
let tennis = {};
let challenges;
//Particle Variables
var particleConfig = {
    particleNumber: 200,
    maxParticleSize: 5,
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
        this.fuel = 100;
        this.acceleration = 2;
        this.plane = "";
        this.mouseDown = false;
    }
    update() {
        ctx = gameArea.context;
        ctx.font = "24px serif";
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
        ctx.drawImage(
            planeimg,
            -this.size / 2,
            -this.size / 2,
            planeimg.width,
            planeimg.height,
        );
        ctx.restore();
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00FFBA";
        ctx.fillText(
            this.displayName,
            gameArea.canvas.width / 2,
            gameArea.canvas.height / 2 - 35,
        );
        ctx.font = "12px serif";
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
        ctx.drawImage(
            planeimg,
            -this.size / 2,
            -this.size / 2,
            planeimg.width,
            planeimg.height,
        );
        ctx.restore();
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#932121";
        ctx.fillText(
            this.displayName,
            -this.x + myPlayer.x + gameArea.canvas.width / 2,
            -this.y + myPlayer.y + gameArea.canvas.height / 2 - 35,
        );
        ctx.font = "12px serif";
        ctx.fillText(
            this.username,
            -this.x + myPlayer.x + gameArea.canvas.width / 2,
            -this.y + myPlayer.y + gameArea.canvas.height / 2 - 25,
        );
    }
}

class Bullet {
    constructor(x, y, angle, player, timestamp, key) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.player = player;
        this.timestamp = timestamp;
        this.key = key;
    }
    draw() {
        ctx = gameArea.context;
        ctx.save();
        ctx.translate(
            -this.x + myPlayer.x + gameArea.canvas.width / 2,
            -this.y + myPlayer.y + gameArea.canvas.height / 2,
        );
        ctx.rotate(this.angle + (Math.PI / 2) * 3);
        ctx.drawImage(bulletImg, 0, 0, -300 / 32, -130 / 32);
        ctx.restore();
    }
    update() {
        this.x -= 100 * Math.cos(this.angle + (Math.PI / 2) * 3);
        this.y -= 100 * Math.sin(this.angle + (Math.PI / 2) * 3);
        db.ref(`bullets/`).child(myPlayer.id).child(this.key).set(this);
        if (Date.now() - this.timestamp > 2000) {
            db.ref(`bullets/`).child(myPlayer.id).child(this.key).remove();
        }
    }
}

//Bomb constuctor
class Bomb {
    constructor(x, y, frame, id) {
        this.x = x;
        this.y = y;
        this.frame = frame;
        this.id = id;
    }

    update() {
        this.frame++;
        if (this.frame >= 20) {
            db.ref(`bombs/${this.id}`).remove();
            bombs.splice(bombs.indexOf(this), 1);
        }
    }

    draw() {
        var frameImage = new Image();
        frameImage.src =
            "https://johnny-airlines.co.uk/bomb/" + this.frame + ".png";
        ctx.drawImage(
            frameImage,
            -this.x + myPlayer.x + gameArea.canvas.width / 2 - 78,
            -this.y + myPlayer.y + gameArea.canvas.height / 2 - 69,
            78 * 2,
            69 * 2,
        );
    }
}

function dropBomb() {
    const bomb = new Bomb(
        myPlayer.x,
        myPlayer.y,
        0,
        Math.floor(Math.random() * 100000000000000000000),
    );
    bombs.push(bomb);
    db.ref(`bombs/${bomb.id}`).set(bomb);
}

function shoot() {
    let bullet = new Bullet(
        myPlayer.x,
        myPlayer.y,
        myPlayer.angle,
        myPlayer.id,
        Date.now(),
        0,
    );
    bulletKey = db.ref(`bullets/${bullet.player}`).push(bullet).key;
    bullet.key = bulletKey;
    db.ref(`bullets/`).child(myPlayer.id).child(bullet.key).update(bullet);
}

//Drawing Functions
function buttonDraw() {
    ctx = gameArea.context;
    ctx.drawImage(
        btn,
        12249 + myPlayer.x + gameArea.canvas.width / 2,
        3249 + myPlayer.y + gameArea.canvas.height / 2,
        800,
        800,
    );
    ctx.font = "250px serif";
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
    ctx.drawImage(mini, Math.floor(gameArea.canvas.width - 200), 0, 200, 200);
    ctx.drawImage(
        playerPoint,
        Math.floor(gameArea.canvas.width - 200 - (myPlayer.x / 16000) * 200) -
            5,
        Math.floor((-myPlayer.y / 16000) * 200) - 5,
        10,
        10,
    );
}

function interact() {
    if (buttonDetectClick(12249, 13049, 3249, 4049)) {
        db.ref("clicks").transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });
        btn.src = "bClicked.png";
        setTimeout(function () {
            btn.src = "bUnclicked.png";
        }, 50);
    } else {
        if (myPlayer.fuel > 1.5) {
            myPlayer.fuel -= 1.5;
            myPlayer.acceleration = 10;
        }
    }
}

function buttonDetectClick(a, b, c, d) {
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

//Start Game
function startGame(displayName, email, uid, plane) {
    gameArea.start();
    gameArea.resize();
    myPlayer = new p();
    myPlayer.displayName = displayName;
    myPlayer.username = email;
    myPlayer.id = uid;
    myPlayer.x = -8000;
    myPlayer.y = -8000;
    define();
    myPlayer.plane = plane;
    sendPlayerToDB(myPlayer);
    // Add a disconnect handler to remove the player from the database
    playersRef.child(myPlayer.id).onDisconnect().remove();
    players.push(myPlayer);
    document.getElementById("pfp").src = plane;
    document.getElementById("dname").innerHTML = displayName;
    document.getElementById("uname").innerHTML = email;
    db.ref("users/" + uid + "/tickets").on("value", (snapshot) => {
        document.getElementById("ticketDisplay").innerHTML =
            ":" + snapshot.val();
    });
    tennis = {
        game: false,
        enemy: "",
    };
    db.ref(`bombs`).on("child_added", (snapshot) => {
        const bombData = snapshot.val();
        const bomb = new Bomb(
            bombData.x,
            bombData.y,
            bombData.frame,
            bombData.id,
        );
        bombs.push(bomb);
    });
    db.ref(`bombs`).on("child_removed", (snapshot) => {
        const bombId = snapshot.key;
        bombs = bombs.filter((bomb) => bomb.id !== bombId);
    });
    db.ref(`bullets`).on("value", (snapshot) => {
        bullets = snapshot.val();
        console.log(bullets);
    });
    db.ref(`bombs`).on("child_removed", (snapshot) => {
        const bulletId = snapshot.key;
        bullets = bullets.filter((bullet) => bullet.id !== bulletId);
        console.log(bullets);
    });
    db.ref("challenges").on("value", (snapshot) => {
        challenges = snapshot.val();
    });
    document.getElementById("shop");
    playersRef.on("value", (snapshot) => {
        players = snapshot.val();
        for (const playerId in players) {
            player = players[playerId];
            if (player.id != myPlayer.id) {
                const playerInstance = new p();
                Object.assign(playerInstance, player);
                playerInstance.draw();
                ctx = gameArea.context;
                ctx.drawImage(
                    otherPlayerPoints,
                    Math.floor(
                        gameArea.canvas.width -
                            200 -
                            (playerInstance.x / 16000) * 200,
                    ) - 5,
                    Math.floor((-playerInstance.y / 16000) * 200) - 5,
                    10,
                    10,
                );
                if (playerInstance.mouseDown) {
                    for (let i = 0; i < 20; i++) {
                        particles.push(
                            new Particle(
                                -1 * playerInstance.x,
                                -1 * playerInstance.y,
                            ),
                        );
                    }
                }
            }
        }
    });
    // Draw all players on the canvas

    updateGameArea();
}

//Update Game Area
function updateGameArea() {
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
    if (myPlayer.x > 0) {
        myPlayer.x -= 16000;
    }
    if (myPlayer.y > 0) {
        myPlayer.y -= 16000;
    }
    if (myPlayer.acceleration > 2) {
        myPlayer.acceleration -= 1;
    }
    if (
        myPlayer.id == "Q4QyRltsO8OdbvxrzlY16xfAw262" &&
        keysPressed.includes(66)
    ) {
        myPlayer.acceleration = 100;
    }

    cleanUpArray();
    if (mouseDown) {
        myPlayer.vx -=
            Math.cos(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
        myPlayer.vy -=
            Math.sin(myPlayer.angle - Math.PI / 2) * myPlayer.acceleration;
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(-1 * myPlayer.x, -1 * myPlayer.y));
        }
    }

    myPlayer.update();
    buttonDraw();
    if (tennis.play) {
        tennisUpdate();
    }
    draw();
    frame();
    for (let bulletPlayerGroup in bullets) {
        for (let bullet in bullets[bulletPlayerGroup]) {
            tempBullet = new Bullet(
                bullets[bulletPlayerGroup][bullet].x,
                bullets[bulletPlayerGroup][bullet].y,
                bullets[bulletPlayerGroup][bullet].angle,
                bullets[bulletPlayerGroup][bullet].player,
                bullets[bulletPlayerGroup][bullet].timestamp,
                bullets[bulletPlayerGroup][bullet].key,
            );
            tempBullet.draw();
            if (bullets[bulletPlayerGroup][bullet].player == myPlayer.id) {
                tempBullet.update();
            }
        }
    }

    myPlayer.planeDraw();
    boostbar();
    miniMap();
    sendPlayerToDB(myPlayer);

    bombs.forEach((bomb) => {
        bomb.update();
        bomb.draw();
    });

    setTimeout(updateGameArea, 20);
}

function paddle(x, y, width, height, playerName) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedModifier = 0;
    this.hasCollidedWith = function (ball) {
        var paddleLeftWall = this.x;
        var paddleRightWall = this.x + this.width;
        var paddleTopWall = this.y;
        var paddleBottomWall = this.y + this.height;
        if (
            ball.x > paddleLeftWall &&
            ball.x < paddleRightWall &&
            ball.y > paddleTopWall &&
            ball.y < paddleBottomWall
        ) {
            return true;
        }
        return false;
    };
    this.move = function (keyCode) {
        var nextY = this.y;
        if (keyCode == 40) {
            nextY = nextY + 5;
            this.speedModifer = 1.5;
        } else if (keyCode == 38) {
            nextY = nextY - 5;
            this.speedModifier = 1.5;
        } else {
            this.speedModifier = 0;
        }
        nextY = nextY < 0 ? 0 : nextY;
        nextY = nextY + this.height > 480 ? 480 - this.height : nextY;
        this.y = nextY;
    };
}
let pl;
let pl2;
let ball;
function define() {
    pl = new paddle(5, 200, 25, 100, "test");
    pl2 = new paddle(610, 200, 25, 100, "Johnny Airlines CEO");

    ball = {
        x: 320 + myPlayer.x + gameArea.canvas.width / 2,
        y: 240 + myPlayer.y + gameArea.canvas.height / 2,
        radius: 3,
        xSpeed: 2,
        ySpeed: 0,
        reverseX: function () {
            this.xSpeed *= -1;
        },
        reverseY: function () {
            this.ySpeed *= -1;
        },
        reset: function () {
            this.x = 320;
            this.y = 240;
            this.xSpeed = 2;
            this.ySpeed = 0;
        },
        isBouncing: function () {
            return ball.ySpeed != 0;
        },
        modifyXSpeedBy: function (modification) {
            modification = this.xSpeed < 0 ? modification * -1 : modification;
            var nextValue = this.xSpeed + modification;
            nextValue = Math.abs(nextValue) > 9 ? 9 : nextValue;
            this.xSpeed = nextValue;
        },
        modifyYSpeedBy: function (modification) {
            modification = this.ySpeed < 0 ? modification * -1 : modification;
            this.ySpeed += modification;
        },
    };
}
function tick() {
    tennisUpdate();
    draw();
    window.setTimeout("tick()", 1000 / 60);
}
function tennisUpdate() {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
    if (ball.x < 0 || ball.x > 640) {
        ball.reset();
    }
    if (ball.y <= 0 || ball.y >= 480) {
        ball.reverseY();
    }
    var collidedWithPlayer = pl.hasCollidedWith(ball);
    var collidedWithPlayer2 = pl2.hasCollidedWith(ball);
    if (collidedWithPlayer || collidedWithPlayer2) {
        ball.reverseX();
        ball.modifyXSpeedBy(0.25);
        var speedUpValue = collidedWithPlayer
            ? pl.speedModifier
            : pl2.speedModifier;
        ball.modifyYSpeedBy(speedUpValue);
    }
    for (var keyCode of keysPressed) {
        pl.move(keyCode);
    }
}
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        2716 + myPlayer.x + gameArea.canvas.width / 2,
        1409 + myPlayer.y + gameArea.canvas.height / 2,
        640,
        480,
    );
    renderPaddle(pl);
    renderPaddle(pl2);
    renderBall(ball);
    ctx.drawImage(
        up,
        2988 + myPlayer.x + gameArea.canvas.width / 2,
        1611 + myPlayer.y + gameArea.canvas.height / 2,
        96,
        96,
    );
}
function renderPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(
        2716 + paddle.x + myPlayer.x + gameArea.canvas.width / 2,
        1409 + paddle.y + myPlayer.y + gameArea.canvas.height / 2,
        paddle.width,
        paddle.height,
    );
}
function renderBall(ball) {
    ctx.beginPath();
    ctx.arc(
        2716 + ball.x + myPlayer.x + gameArea.canvas.width / 2,
        1409 + ball.y + myPlayer.y + gameArea.canvas.height / 2,
        ball.radius,
        0,
        2 * Math.PI,
        false,
    );
    ctx.fillStyle = "white";
    ctx.fill();
}

// Function to send a challenge to another user
function sendChallenge(challengedUid) {
    const challengeRef = db.ref(`challenges/${myPlayer.id}/${challengedUid}`);
    challengeRef.set({
        status: "pending",
        challengerUid: myPlayer.id,
        challengedUid,
        timestamp: Date.now(),
    });
}

// Function to accept or deny a challenge
function respondToChallenge(challengeUid, response) {
    const challengeRef = db.ref(`challenges/${challengeUid}/${myPlayer.id}`);
    challengeRef.update({
        status: response === "accept" ? "accept" : "denied",
    });
}

// Function to get the status of a challenge
function getChallengeStatus(challengedUid) {
    const challengeRef = db.ref(`challenges/${myPlayer.id}/${challengedUid}`);
    return challengeRef.once("value").then((snapshot) => {
        return snapshot.val().status;
    });
}
//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

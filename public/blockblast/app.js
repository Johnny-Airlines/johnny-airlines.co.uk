"use strict";

const tileWidth = 8;
const scaleFactor = 10;
const scaledUpTileWidth = tileWidth * scaleFactor;
const borderWidth = 3;

const colours = ["DarkGreen","Crimson","DarkBlue"]
const shapes = [
	[[0,0],[0,1],[0,2],[0,3]],
	[[0,0],[0,1],[0,2],[1,2]],
	[[0,0],[0,1],[0,2]],
	[[0,0],[0,1],[1,0],[1,1]],
	[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],
	[[0,0],[1,0]],
	[[0,0],[0,1]],
	[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]],
	[[0,0],[1,0],[2,0],[3,0],[4,0]],
	[[0,0],[0,1],[1,0]],
	[[1,0],[2,0],[0,1],[1,1]],
	[[0,0],[0,1],[1,1],[1,2]],
	[[0,0],[0,1],[1,1],[2,1]],
	[[0,0],[0,1],[0,2],[0,3],[0,4]],
	[[0,0],[0,1],[0,2],[1,0]],
	[[1,0],[1,1],[1,2],[0,2]],
	[[0,0],[1,0],[2,0]],
	[[0,0],[0,1],[1,1]],
	[[0,0],[1,0],[2,0],[2,1],[2,2]]
]

const gameContainer = document.getElementById("game-container");
const ctx = gameContainer.getContext("2d")
ctx.fillStyle = "red"
gameContainer.getContext("2d").fillRect(0,0,tileWidth*scaleFactor*8,tileWidth*scaleFactor*8)

function randomColor() {
	return colours[Math.floor(Math.random()*colours.length)]
}

function drawTile(x,y,color) {
	ctx.fillStyle = "black"
	ctx.fillRect(x*scaledUpTileWidth,y*scaledUpTileWidth,scaledUpTileWidth,scaledUpTileWidth)
	ctx.fillStyle = color
	ctx.fillRect(x*scaledUpTileWidth+borderWidth,y*scaledUpTileWidth+borderWidth,scaledUpTileWidth-borderWidth*2,scaledUpTileWidth-borderWidth*2)
}

function drawShape(x,y,color,shapeIndex) {
	for (const positions of shapes[shapeIndex]) {
		drawTile(x+positions[0],y+positions[1],color)
	}
}

//Draw bg
for (let i=0;i<8;i++) {
	for (let j=0;j<8;j++) {
		drawTile(i,j,"DarkSlateBlue")
	}
}

drawShape(0,0,randomColor(),prompt())
let x = 0;
hehehe()
function hehehe() {
	if (x > 7) { x -= 8 }
	drawShape(Math.floor(Math.random()*8),Math.floor(Math.random()*8),randomColor(),x)
	x += 1;
	setTimeout(hehehe,1000)
}

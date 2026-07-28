"use strict";

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const patternColumn1 = document.getElementById("patternColumn1");
const patternColumn2 = document.getElementById("patternColumn2");

const gridLinesWidth = 0.1;

const gpsSlider = document.getElementById("gps");
const gpsLabel = document.getElementById("gpsLabel");
var gps = 5;
var realGps = 0;
gpsSlider.addEventListener("change", (e) => {
	gpsLabel.innerText = `Target Generations per second: ${gpsSlider.value}`;
	gps = gpsSlider.valueAsNumber;
});

const zoomSlider = document.getElementById("zoom");
const zoomLabel = document.getElementById("zoomLabel");
var cellWidth = 50;
var zoom = 1;

canvas.addEventListener("wheel", (e) => {
	let newZoom = zoom;
	if (e.deltaY < 0) {
		newZoom *= 1.1;
	} else {
		newZoom /= 1.1;
	}
	newZoom = Math.max(0.001, Math.min(newZoom, Math.min(canvas.width, canvas.height) / (2 * 50)));
	offsetX = e.offsetX - (e.offsetX - offsetX) * (newZoom / zoom);
	offsetY = e.offsetY - (e.offsetY - offsetY) * (newZoom / zoom);
	zoom = newZoom;
	cellWidth = 50 * zoom;
	render();
});

var playing = false;
const playSVG = document.getElementById("playSVG");
const pauseSVG = document.getElementById("pauseSVG");
function togglePlaying() {
	playing = !playing;
	if (playing) {
		pauseSVG.style.display = "";
		playSVG.style.display = "none";
		generation();
	} else {
		playSVG.style.display = "";
		pauseSVG.style.display = "none";
		let id = window.setTimeout(()=>{},0);
		while (id--) {
			window.clearTimeout(id);
		}
	}
}

addEventListener("keypress", (e) => {
	if (e.code == "Space") {
		togglePlaying();
	}
});

var life = new Set();
life.add("2,0");
life.add("0,1");
life.add("2,1");
life.add("1,2");
life.add("2,2");

var offsetX = 5;
var offsetY = 5;

var isMouseDown = false;
var editMode = "normal";
var isDragKeyDown = false;
const dragKey = "Control";
var isDeleteKeyDown = false;
var deleteKey = "Shift";
addEventListener("keydown", (e) => {
	if (e.key == dragKey) {
		isDragKeyDown = true;
		canvas.style.cursor = "grab"
	}
	if (e.key == deleteKey) {
		isDeleteKeyDown = true;
		canvas.style.cursor = "not-allowed";
	}
});
addEventListener("keyup", (e) => {
	if (isDragKeyDown && e.key == dragKey) {
		isDragKeyDown = false;
		canvas.style.cursor = "";
	}
	if (isDeleteKeyDown && e.key == deleteKey) {
		isDeleteKeyDown = false;
		canvas.style.cursor = "";
	}
});
canvas.addEventListener("mousedown", (e) => {
	isMouseDown = true;
	if (!isDragKeyDown) {
		let cellX = Math.floor((-offsetX + e.offsetX) / cellWidth);
		let cellY = Math.floor((-offsetY + e.offsetY) / cellWidth);
		let targetCell = cellArrToString([cellX,cellY]);
		if (life.has(targetCell)) {
			life.delete(targetCell);
		} else {
			life.add(targetCell);
		}
	}
	if (isDragKeyDown) {
		canvas.style.cursor = "grabbing";
	}
});
canvas.addEventListener("mouseup", (e) => {
	isMouseDown = false;
	if (isDragKeyDown) {
		canvas.style.cursor = "grab";
	}
	render();
});

canvas.addEventListener("mousemove", (e) => {
	if (isMouseDown) {
		if (isDragKeyDown) {
			offsetX += e.movementX * 1;
			offsetY += e.movementY * 1;
		} else {
			let cellX = Math.floor((-offsetX + e.offsetX) / cellWidth);
			let cellY = Math.floor((-offsetY + e.offsetY) / cellWidth);
			let cell = cellArrToString([cellX,cellY]);
			if (isDeleteKeyDown) {
				life.delete(cell);
			} else {
				life.add(cell);
			}
		}
	}
	render();
});

function render(showInfo = true) {
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	life.forEach((cell) => {
		cell = cellStringToArr(cell);
		ctx.rect(offsetX + cell[0] * cellWidth, offsetY + cell[1] * cellWidth, cellWidth, cellWidth);
	});
	ctx.fill();
	if (gridLinesWidth * zoom > 0.01) {
		for (let i = (offsetX % cellWidth) / cellWidth; i < canvas.width / cellWidth; i++) {
			ctx.fillRect(i * cellWidth, 0, gridLinesWidth * zoom, canvas.height);
		}
		for (let i = (offsetY % cellWidth) / cellWidth; i < canvas.height / cellWidth; i++) {
			ctx.fillRect(0, i * cellWidth, canvas.width, gridLinesWidth * zoom);
		}
	}
	if (showInfo) {
		ctx.font = "30px serif";
		ctx.fillText(`Population: ${life.size}, GpS: ${Math.round(realGps)}`,0,canvas.height);
	}
}

function step() {
	let neighbourCounts = {};
	let cellsToConsider = new Set();
	life.forEach(cell => {
		cell = cellStringToArr(cell);
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				let neighbour = [cell[0]+i,cell[1]+j];
				cellsToConsider.add(cellArrToString(neighbour));
			}
		}
	});

	let newLife = new Set();
	cellsToConsider.forEach((cell) => {
		let cString = cell;
		let count = 0;
		cell = cellStringToArr(cell);
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				let neighbour = [cell[0]+i,cell[1]+j];
				count += life.has(cellArrToString(neighbour)) ? 1 : 0;
			}
		}
		count -= life.has(cString) ? 1 : 0;
		if (count == 3 || (count == 2 && life.has(cString))) {
			newLife.add(cString);
		}
	});

	life = structuredClone(newLife);
}

function generation() {
	let startTime = performance.now()
	step();
	render();
	if (playing) {
		realGps = (1000 / (performance.now() - startTime)) > gps ? gps: (1000 / (performance.now() - startTime));
		setTimeout(generation, (1000 / gps) - (performance.now() - startTime));
	}
}

function cellStringToArr(cell) {
	cell = cell.split(",");
	cell = cell.map((coord) => parseInt(coord));
	return cell
}

function cellArrToString(cell) {
	return `${cell[0]},${cell[1]}`;
}

function exportPattern(patternSet) {
	return LZString.compressToBase64([...patternSet].join(';'));
}

function importPattern(patternString) {
	var patternSet = new Set();
	LZString.decompressFromBase64(patternString).split(";").forEach((coord) => {
		patternSet.add(coord)
	});
	return patternSet;
}

function translatePattern(patternSet,x,y) {
	var newPattern = new Set();
	patternSet.forEach((cell) => {
		cell = cellStringToArr(cell);
		cell[0] += x;
		cell[1] += y;
		cell = cellArrToString(cell);
		newPattern.add(cell);
	})
	return newPattern;
}

function extractPattern(board,topLeftCell,bottomRightCell) {
	let pattern = new Set();
	topLeftCell = cellStringToArr(topLeftCell);
	bottomRightCell = cellStringToArr(bottomRightCell);
	let trueTopLeft = structuredClone(bottomRightCell);
	for (let i = topLeftCell[0]; i < bottomRightCell[0]; i++) {
		for (let j = topLeftCell[1]; j < bottomRightCell[1]; j++) {
			let cell = cellArrToString([i,j]);
			if (board.has(cell)) {
				pattern.add(cell);
				cell = [i,j];
				if (i < trueTopLeft[0]) {
					trueTopLeft[0] = i;
				}
				if (j < trueTopLeft[1]) {
					trueTopLeft[1] = j;
				}
			}
		}
	}
	pattern = translatePattern(pattern,-trueTopLeft[0],-trueTopLeft[1])
	return exportPattern(pattern);
}

function photoPattern(patternString,caption) {
	let pattern = importPattern(patternString);
	let bottomRightCell = [-Infinity,-Infinity];
	pattern.forEach((cell) => {
		cell = cellStringToArr(cell);
		bottomRightCell[0] = cell[0] > bottomRightCell[0] ? cell[0] : bottomRightCell[0];
		bottomRightCell[1] = cell[1] > bottomRightCell[1] ? cell[1] : bottomRightCell[1];
	});

	let prevOffsetX = offsetX;
	let prevOffsetY = offsetY;
	let prevCanvasWidth = canvas.width;
	let prevCanvasHeight = canvas.height;
	let prevCellWidth = cellWidth;
	let prevLife = structuredClone(life);

	offsetX = 2;
	offsetY = 2;
	let largestSideWidth = bottomRightCell[0] > bottomRightCell[1] ? bottomRightCell[0] : bottomRightCell[1];
	cellWidth = 500/(largestSideWidth+1);
	canvas.width = (bottomRightCell[0] + 1)*cellWidth+4;
	canvas.height = (bottomRightCell[1] + 1)*cellWidth+4;
	life = structuredClone(pattern);

	render(false);
	let imgUrl = canvas.toDataURL("image/webp");

	offsetX = prevOffsetX;
	offsetY = prevOffsetY;
	canvas.width = prevCanvasWidth;
	canvas.height = prevCanvasHeight;
	cellWidth = prevCellWidth;
	life = structuredClone(prevLife);


	let patternContainer = document.createElement("div");
	patternContainer.className = "patternContainer";
	patternContainer.onclick = () => {insertPattern(patternString)};	
	let patternImg = document.createElement("img");
	patternImg.className = "patternImg";
	patternImg.src = imgUrl;
	let patternCaption = document.createElement("p");
	patternCaption.className = "patternCaption";
	patternCaption.innerText = caption;

	patternContainer.appendChild(patternImg);
	patternContainer.appendChild(patternCaption);

	if (patternColumn1.childElementCount > patternColumn2.childElementCount) {
		patternColumn2.appendChild(patternContainer);
	} else {
		patternColumn1.appendChild(patternContainer);
	}
}

function insertPattern(patternString) {
	life = importPattern(patternString);
	render();
}

const premadePatterns = {
	"Glider": "AwGgjA3GIEwTJj3MmQ==",
	"GG Gun": "AwGgLA3KCsEIzniWdSVc+oBs8EGY8QB2eAJhDPJAA559L7b4xM5oRD2T5tE4+KPrjjFMZUFQmcI0yGQRSCshPIpxZFWGVbBZrDTvGtc+VlTMz8HCx3xA",
	"Block layer": "AwGgrA3ATCAs3grEBGJIroMwQGwmD1SMwHZUg===",
	"2 block layers": "AwGmG4EY3AmGDMMAsMCsMBsMDsMCcMkoEk0p8pSpepAHEYRLNs7XA80+AiT+T0o9UEBBlGse7BJyA===",
}
setTimeout(() => {
	for (const [caption,patternString] of Object.entries(premadePatterns)) {
		photoPattern(patternString,caption)
	}
	setTimeout(()=>{render()},50);
},500);

render();

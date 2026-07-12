"use strict";

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const gpsSlider = document.getElementById("gps");
const gpsLabel = document.getElementById("gpsLabel");
var gps = 5;
gpsSlider.addEventListener("change",(e) => {
	gpsLabel.innerText = `Target Generations per second: ${gpsSlider.value}`; 
	gps = gpsSlider.valueAsNumber;
});

var life = new Set();
life.add("2,0");
life.add("0,1");
life.add("2,1");
life.add("1,2");
life.add("2,2");

function render() {
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0,0,900,900);
	ctx.fillStyle = "#000000";
	life.forEach((cell) => {
		cell = cell.split(",");
		cell = cell.map((item) => parseInt(item));
		ctx.fillRect(cell[0]*50,cell[1]*50,50,50);
	});
}

function step() {
	let neighbourCounts = {};
	let cellsToConsider = new Set();
	life.forEach(cell => {
		cell = cell.split(",");
		cell = cell.map((item) => parseInt(item));
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				cellsToConsider.add(`${cell[0]+i},${cell[1]+j}`);
			}
		}
	});

	let newLife = new Set();
	cellsToConsider.forEach((cell) => {
		let cString = cell;
		cell = cell.split(",");
		let count = 0;
		cell = cell.map((item) => parseInt(item));
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				count += life.has(`${cell[0]+i},${cell[1]+j}`) ? 1 : 0;
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
	render();
	step();
	setTimeout(generation, 1000/gps);
}

generation();

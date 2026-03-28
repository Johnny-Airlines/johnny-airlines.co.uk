"use strict";

class Complex {
	constructor(real,imaginary) {
		this.real = real;
		this.imaginary = imaginary;
	}

	square() {
		let oldReal = this.real
		let oldImaginary = this.imaginary
		this.real = oldReal**2 - oldImaginary**2
		this.imaginary = 2 * oldReal * oldImaginary
	}

	add(a) {
		this.real += a.real;
		this.imaginary += a.imaginary;
	}

	magnitudeSQ() {
		return (this.real**2+this.imaginary**2)
	}
}

function min(a,b) {
	if (a < b) {
		return a
	} else {
		return b	
	}
}

function lerp( a, b, alpha ) {
	return a + alpha * ( b - a )
}

function test(c) {
	let z = new Complex(0,0)
	let iterations = 0
	let values = []
	while (iterations < upperBound) {
		iterations ++;
		z.square()
		z.add(c)
		values.push(z)
		if (z.magnitudeSQ() > 4) {
			return iterations;
		}
	}
	return false

}

function clean(el, def) {
	while (isNaN(el.value)) {
		el.value = el.value.slice(0,-1);
	}
	if (isNaN(parseInt(el.value))) { el.value = def }
	el.value = parseInt(el.value);
	return parseInt(el.value);
}

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
ctx.translate(0, canvas.height);
ctx.scale(1, -1);
var zoom = 1;
var upperBound = 50;
var lowerBoundX = -2;
var upperBoundX = 1;
var lowerBoundY = -1;
var upperBoundY = 1;
var width = upperBoundX - lowerBoundX;
var height = upperBoundY - lowerBoundY;
canvas.style.height = height * 400 * zoom;
canvas.style.width = width * 400 * zoom;
canvas.height = height*400*zoom;
canvas.width = width*400*zoom;
var resolutionX = width/canvas.width;
var resolutionY = height/canvas.height;

const upperBoundInput = document.getElementById("upperBound");
upperBoundInput.value = "50"
upperBoundInput.addEventListener("change",(e) => {
	upperBound = clean(upperBoundInput,50);	
	render();
});

function reset() {
	lowerBoundX = -2;
	upperBoundX = 1;
	lowerBoundY = -1;
	upperBoundY = 1;
	upperBoundInput.value = 50;
	upperBound = 50;
	render();
}

var setData;
function zoomTL(e) {
	ctx.putImageData(setData,0,0);
	let rect = canvas.getBoundingClientRect();
	let x = (e.clientX - rect.left)/(parseInt(canvas.style.width.slice(0,-2))) * width + lowerBoundX;
	let y = (e.clientY - rect.top)/(parseInt(canvas.style.height.slice(0,-2))) * height + lowerBoundY;
	ctx.fillStyle = "red";
	ctx.fillRect(e.clientX - rect.left-2,e.clientY-rect.top,4,30)
	ctx.fillRect(e.clientX - rect.left,e.clientY-rect.top-2,30,4)
}

function zoomBR(e) {
	ctx.putImageData(setData,0,0);
	let rect = canvas.getBoundingClientRect();
	let x = (e.clientX - rect.left)/(parseInt(canvas.style.width.slice(0,-2))) * width + lowerBoundX;
	let y = (e.clientY - rect.top)/(parseInt(canvas.style.height.slice(0,-2))) * height + lowerBoundY;
	ctx.fillStyle = "red";
	ctx.fillRect(e.clientX - rect.left-2,e.clientY-rect.top-30,4,30)
	ctx.fillRect(e.clientX - rect.left-30,e.clientY-rect.top-2,30,4)
}

function zoomTool() {
	setData = ctx.getImageData(0,0,canvas.width,canvas.height);
	canvas.addEventListener("mousemove",zoomTL);
	canvas.addEventListener("mousedown", (e) => {
		let rect = canvas.getBoundingClientRect();
		let lx = (e.clientX - rect.left)/(parseInt(canvas.style.width.slice(0,-2))) * width + lowerBoundX;
		let ly = (e.clientY - rect.top)/(parseInt(canvas.style.height.slice(0,-2))) * height + lowerBoundY;
		ctx.putImageData(setData,0,0);
		ctx.fillStyle = "red";
		ctx.fillRect(e.clientX - rect.left-2,e.clientY-rect.top,4,30)
		ctx.fillRect(e.clientX - rect.left,e.clientY-rect.top-2,30,4)
		canvas.removeEventListener("mousemove",zoomTL);
		setData = ctx.getImageData(0,0,canvas.width,canvas.height);	
		canvas.addEventListener("mousemove",zoomBR);
		canvas.addEventListener("mousedown", (e) => {
			let rect = canvas.getBoundingClientRect();
			canvas.removeEventListener("mousemove",zoomBR);
			let ux = (e.clientX - rect.left)/(parseInt(canvas.style.width.slice(0,-2))) * width + lowerBoundX;
			let uy = (e.clientY - rect.top)/(parseInt(canvas.style.height.slice(0,-2))) * height + lowerBoundY;
			lowerBoundX = lx;
			lowerBoundY = ly;
			upperBoundX = ux;
			upperBoundY = uy;
			render();
		},{"once":true});
	},{"once":true});
	
}

var i = lowerBoundX;
render();

function render() {
	i = lowerBoundX;
	height = upperBoundY - lowerBoundY;
	width = upperBoundX - lowerBoundX;
	zoom = min((1200/400) / width, (800/400) / height);
	canvas.style.height = height * 400 * zoom;
	canvas.style.width = width * 400 * zoom;
	canvas.height = height*400*zoom;
	canvas.width = width*400*zoom;
	resolutionX = width/canvas.width;
	resolutionY = height/canvas.height;
	const highestId = window.setTimeout(() => {
		for (let i = highestId; i >= 0; i--) {
			window.clearInterval(i);
		}
	}, 0);

	loop();
}

function loop() {
	for (let j = lowerBoundY; j < upperBoundY;j += resolutionY) {
		let c = new Complex(i,j)
		let res = test(c);
		if (res) {
			ctx.fillStyle = `rgb(${res/upperBound * 255},${res/upperBound * 255},${200})`
		} else {
			ctx.fillStyle = "black";
		}
		ctx.fillRect((i-lowerBoundX)/width * canvas.width,(j-lowerBoundY)/height * canvas.height,Math.ceil(resolutionX/width * canvas.width),Math.ceil(resolutionY/height* canvas.width))
	}
	i += resolutionX
	if (i < upperBoundX) {
		setTimeout(loop,1);
	}

}

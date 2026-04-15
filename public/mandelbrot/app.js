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

function round(number,step) {
	return Math.round(number / step) * step;
}

function lerp( a, b, alpha ) {
	return a + alpha * ( b - a )
}

function test(c) {
	return wasmTest(c,upperBound)
	let z = new Complex(0,0);
	let iterations = 0;
	let values = [];
	while (iterations < upperBound) {
		iterations ++;
		z.square();
		z.add(c);
		if (values.some((val)=>{return val.real==z.real&&val.imaginary==z.imaginary})) {
			return false;
		}
		values.push(new Complex(z.real, z.imaginary));
		if (z.magnitudeSQ() > 4) {
			return iterations;
		}
	}
	return false
}

function checkRect(a,b) {
	let iterLevel = test(a);
	if (b.real - a.real <= resolutionX && b.imaginary - a.imaginary <= resolutionY) {
		return {"res": iterLevel}
	}
	for (let k = a.real;k < b.real; k += resolutionX) {
		let l = a.imaginary;
		let res = test(new Complex(k,l));
		if (res != iterLevel) {
			return false
		}
	}
	for (let k = a.real; k < b.real; k += resolutionX) {
		let l = b.imaginary;
		let res = test(new Complex(k,l));
		if (res != iterLevel) {
			return false
		}
	}
	for (let l = a.imaginary; l < b.imaginary; l += resolutionY) {
		let k = a.real;
		let res = test(new Complex(k,l));
		if (res != iterLevel) {
			return false
		}
	}
	for (let l = a.imaginary; l < b.imaginary; l += resolutionY) {
		let k = b.real;
		let res = test(new Complex(k,l));
		if (res != iterLevel) {
			return false
		}
	}
	return {"res":iterLevel};
}

var stack = [];
function doRect(a,b) {
	let res = checkRect(a,b);
	if (!res) {
		let mid = new Complex((a.real+b.real)/2,(a.imaginary+b.imaginary)/2);
		if (b.real - a.real > b.imaginary - a.imaginary) {
			stack.push([a, new Complex(mid.real,b.imaginary)]);
			stack.push([new Complex(mid.real,a.imaginary),b]);
		} else {
			stack.push([a, new Complex(b.real,mid.imaginary)])
			stack.push([new Complex(a.real,mid.imaginary),b])
		}
	} else {
		res = res["res"];
		let coolor;
		if (res) {
			coolor = `rgb(${res/upperBound * 255},${res/upperBound * 255},${200})`
		} else {
			coolor = "black";
		}
		let x1 = (a.real-lowerBoundX)/width * canvas.width;
		let y1 = (a.imaginary-lowerBoundY)/height * canvas.height;
		let x2 = (b.real-lowerBoundX)/width * canvas.width
		let y2 = (b.imaginary-lowerBoundY)/height * canvas.height;
		ctx.fillStyle = coolor
		ctx.fillRect(x1,y1,x2-x1+1,y2-y1+1);
	}
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
	fullRender();
});

var f;
var wasmTest;
var compare;
Module.onRuntimeInitialized = () => {
	f = Module.cwrap("test","number",["number","number","number"]);
	wasmTest = (c,u) => {
		let res = f(c.real,c.imaginary,u);
		if (res == 0) {
			return false
		} else {
			return res
		}
	}
	fullRender();
	compare = (b) => {
		console.time("JS")
		for (let m = 0; m < b; m++) {
			let val = new Complex(Math.random()*4-2,Math.random()*4-2);
			test(val);
		}
		console.timeEnd("JS")
		console.time("C-WASM")
		for (let m = 0; m < b; m++) {
			let val = new Complex(Math.random()*4-2,Math.random()*4-2);
			wasmTest(val);
		}
		console.timeEnd("C-WASM")
	}
}

canvas.addEventListener("mousedown", (e) => {
	let rect = canvas.getBoundingClientRect();
	let lx = (e.clientX - rect.left)/(parseInt(canvas.style.width.slice(0,-2))) * width + lowerBoundX;
	let ly = (e.clientY - rect.top)/(parseInt(canvas.style.height.slice(0,-2))) * height + lowerBoundY;
	console.table({"x":lx,"y":ly})
});

function reset() {
	lowerBoundX = -2;
	upperBoundX = 1;
	lowerBoundY = -1;
	upperBoundY = 1;
	upperBoundInput.value = 50;
	upperBound = 50;
	fullRender();
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
			fullRender();
		},{"once":true});
	},{"once":true});
}
var i = lowerBoundX;
function fullRender() {
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
	}, 0)
	//render();
	let startTime = performance.now();
	stack = [[new Complex(lowerBoundX,lowerBoundY), new Complex(upperBoundX,upperBoundY)]];
	let maxStackLength = 1;
	while (stack.length != 0) {
		let args = stack.shift(0);
		doRect(args[0],args[1]);
		if (stack.length > maxStackLength) { maxStackLength = stack.length }
	}
	console.log(performance.now() - startTime)
	console.log(maxStackLength);
}

function loop() {
	if (stack.length != 0) {
		let args = stack.pop();
		doRect(args[0],args[1]);
		//requestAnimationFrame(()=>{loop});
		//setTimeout(loop,100)
		loop()
	}
}

function iterativeRender() {
	upperBound = 1
	while (upperBound < 500) {
		fullRender();
		upperBound += 50;
	}
}

function line() {
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
}

function render() {
	for (let a = 0; a < 10; a += 1) {
		line();
		i += resolutionX
	}
	if (i < upperBoundX) {
		render();
		//requestAnimationFrame(render);
	}
}

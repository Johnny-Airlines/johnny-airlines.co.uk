"use strict";

function dot(a, b){
	//console.log(`Dot: ${a} . ${b} = ${a[0]*b[0]+a[1]*b[1]}`);
	return a[0]*b[0]+a[1]*b[1];
}

function add(a, b) {
	//console.log(`Add: ${a} + ${b} = ${[a[0]+b[0],a[1]+b[1]]}`);
	return [a[0]+b[0],a[1]+b[1]];
}

function multiply(a, b) {
	if (isNaN(a[0]*b)) {
		console.log(`Multiply: ${a} * ${b} = ${[a[0]*b,a[1]*b]}`);
		throw new Error("NO")
	}
	return [a[0]*b,a[1]*b];
}

function minus(a, b) {
	//console.log(`Minus: ${a} - ${b} = ${add(a,multiply(b,-1))}`);
	return add(a,multiply(b,-1));
}

function magnitude(a) {
	//console.log(`Magnitude of ${a} = ${(a[0]**2+a[1]**2)**0.5}`);
	return (a[0]**2+a[1]**2)**0.5;
}

function normalize(a) {
	return [a[0]/magnitude(a),a[1]/magnitude(a)];
}

function ran(max,min) {
	return (Math.random() * (max - min)) + min;
}

class Particle {
	constructor(x, y) {
		this.x = x || ran(0,canvas.width);
		this.y = y || ran(0,canvas.height);
		this.vx = ran(-1,1);
		this.vy = ran(-1,1);
		this.ax = 0;
		this.ay = GRAVITY;
		this.radius = 10;
		this.mass = this.radius ** 2;
		this.colour = `rgb(${ran(0,100)},${ran(0,100)},${ran(0,100)})`;
		this.COLOUR = this.colour;
		this.isLocked = false;
		this.trace = false;
		this.tracePositions = [];
		this.collides = true;
		this.visible = true;
	}
	
	update() {
		this.previousState = [this.x,this.y];
		if (currentPreset == "Earth") {
			this.ay = GRAVITY;
		}
		else if (currentPreset == "Space") {
			this.calcUniversalGravitation();
		}
		if (this.isLocked) {
			this.vx = 0;
			this.vy = 0;
			this.ax = 0;
			this.ay = 0;
			this.x = 350;
			this.y = 350;
		}
		if (this.trace) {
			this.tracePositions.push([this.x,this.y]);
			if (this.tracePositions.length > 1000) {
				this.tracePositions.shift();
			}
		}
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;

		if (this.y-this.radius < 0) {
			this.vy *= -1 * wall_particle_res;
			this.y = this.radius;
		} else if (this.y+this.radius > canvas.height) {
			this.vy *= -1 * wall_particle_res;
			this.y = canvas.height - this.radius;
		}

		if (this.x-this.radius < 0) {
			this.vx *= -1 * wall_particle_res;
			this.x = this.radius;
		} else if (this.x+this.radius > canvas.width) {
			this.vx *= -1 * wall_particle_res;
			this.x = canvas.width - this.radius;
		}
		if (this.collides) {
			this.collision();
		}
		if (this.visible) {
			this.draw();
		}
	}
	
	calcUniversalGravitation() {
		let resultantForce = [0,0];
		particles.forEach((particle) => {
			if (particle != this) {
				let direction = [this.x-particle.x,this.y-particle.y];
				let force = (G*this.mass*particle.mass)/(magnitude(direction)**2);
				resultantForce = add(resultantForce,multiply(normalize(direction),force*-1));
			}
		});
		this.ax = resultantForce[0];
		this.ay = resultantForce[1];
	}

	collision() { 
		particles.forEach((particle) => {
			if (particle != this && particle.collides) {
				if (((particle.x-this.x)**2+(particle.y-this.y)**2)**0.5 < this.radius + particle.radius) {
					let vectorBetween = [particle.x-this.x,particle.y-this.y]
					let overlap = multiply(normalize(vectorBetween),(this.radius+particle.radius-magnitude(vectorBetween))/2);
					this.x -= overlap[0];
					this.y -= overlap[1];
					particle.x += overlap[0];
					particle.y += overlap[1];

					particle.colour = "red";
					this.colour = "red";
					setTimeout(() => {
						particle.colour = particle.COLOUR;
						this.colour = this.COLOUR;
					},5);
					let m1 = this.mass;
					let m2 = particle.mass;
					let x1 = [this.x, this.y];
					let x2 = [particle.x, particle.y];
					let v1 = [this.vx, this.vy];
					let v2 = [particle.vx, particle.vy];

					let v1After = minus(v1,multiply(minus(x1,x2),(2*m2/(m1+m2))*dot(minus(v1,v2),minus(x1,x2))/magnitude(minus(x1,x2))**2));
					let v2After = minus(v2,multiply(minus(x2,x1),(2*m1/(m1+m2))*dot(minus(v2,v1),minus(x2,x1))/magnitude(minus(x2,x1))**2));
					
					let e = 0.1;
					let v1MagAfter = (m1*magnitude(v1)+m2*magnitude(v2)+m2*e*(magnitude(v2)-magnitude(v1)))/(m1+m2);
					let v2MagAfter = (m1*magnitude(v1)+m2*magnitude(v2)+m1*e*(magnitude(v1)-magnitude(v2)))/(m1+m2);

					v1After = multiply(normalize(v1After),v1MagAfter);
					v2After = multiply(normalize(v2After),v2MagAfter);

					this.vx = v1After[0];
					this.vy = v1After[1];
					particle.vx = v2After[0];
					particle.vy = v2After[1];
				}
			}
		});
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = this.colour;
		ctx.arc(this.x,this.y,this.radius-1,0,Math.PI*2);
		ctx.fill();

		if (this.trace) {
			for (const index in this.tracePositions) {
				let position = this.tracePositions[index];
				ctx.beginPath();
				ctx.fillStyle = `rgb(100,00,00,${index/this.tracePositions.length})`
				ctx.arc(position[0],position[1],2,0,Math.PI*2);
				ctx.fill();
			}
		}
	}
}

function setPreset(preset) {
	if (preset == "Earth") {
		currentPreset = "Earth"
		preCalcGravity = -9.8
		targetTPS = 60;
		PX_PER_METER = 100;
		GRAVITY = (preCalcGravity * PX_PER_METER) / (targetTPS ** 2);
	} else if (preset == "Space") {
		G = 0.5;
		currentPreset = "Space";
	} else if (preset == "Orbit") {
		G = 0.0005;
		currentPreset = "Space";
		particles = [];
		for (let i = 0; i < 50; i++) {
			let p = new Particle();
			p.radius = 5;
			particles.push(p);
		}
		let p = new Particle();
		p.radius = 50;
		p.x = 350;
		p.y = 350;
		p.vx = 0;
		p.vy = 0;
		p.trace = true;
		p.isLocked = true;
		particles.push(p);
	} else if (preset == "Planets forming") {
		particles = [];
		G = 0.0001;
		for (let i = 0; i < 500; i++) {
			let p = new Particle();
			p.radius = 3;
			let max = 1;
			p.vx = ran(-max,max);
			p.vy = ran(-max,max);
			particles.push(p);
		}
	}
	document.getElementById("targetTPS").value = targetTPS;
	document.getElementById("gravity").value = GRAVITY;
}

var preCalcGravity = -9.8
var targetTPS = 60;
var PX_PER_METER = 100;
var GRAVITY = (preCalcGravity * PX_PER_METER) / (targetTPS ** 2);
const wall_particle_res = 0.9;
var G;
var currentPreset = "Earth"
setPreset("Space");

document.getElementById("targetTPS").addEventListener("input",(e) => {
	targetTPS = document.getElementById("targetTPS").value;
});

document.getElementById("gravity").addEventListener("input",(e) => {
	preCalcGravity = document.getElementById("gravity").value;
	GRAVITY = (preCalcGravity * PX_PER_METER) / (targetTPS ** 2);
	particles.forEach((particle) => {
		particle.ay = GRAVITY;
	});
});

var paused = false;
document.onkeypress = (e) => {
	if (e.key == " ") {
		paused = !paused;
		if (!paused) {
			update();
		}
	}
};

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var particles = [];
setPreset("Planets forming");

update();
function update() {
	ctx.fillStyle = "rgba(255,255,255,0.3)";
	//ctx.fillStyle = "white";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	particles.forEach((particle) => {
		particle.update();
	});
	if (!paused) {
		setTimeout(update,1000/targetTPS);
	}
}

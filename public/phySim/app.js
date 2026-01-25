"use strict";

function dot(a, b){
	return a[0]*b[0]+a[1]*b[1];
}

function add(a, b) {
	//console.log(`Add: ${a} + ${b} = ${[a[0]+b[0],a[1]+b[1]]}`);
	return [a[0]+b[0],a[1]+b[1]];
}

function multiply(a, b) {
	//console.log(`Multiply: ${a} * ${b} = ${[a[0]*b,a[1]*b]}`);
	return [a[0]*b,a[1]*b];
}

function minus(a, b) {
	return add(a,multiply(b,-1));
}

function magnitude(a) {
	return (a[0]**2+a[1]**2)**0.5;
}

function ranInt(max,min) {
	return Math.floor(Math.random() * (max - min)) + min;
}

class Particle {
	constructor(x, y) {
		this.x = x || ranInt(0,canvas.width);
		this.y = y || ranInt(0,canvas.height);
		this.vx = ranInt(-10,10);
		this.vy = ranInt(-10,10);
		this.ax = 0;
		this.ay = GRAVITY;
		this.radius = 10;
		this.mass = this.radius ** 2;
		this.colour = `rgb(${ranInt(0,100)},${ranInt(0,100)},${ranInt(0,100)})`;
		this.COLOUR = this.colour;
	}
	
	update() {
		this.previousState = [this.x,this.y];
		this.ay = GRAVITY;
		this.vx += this.ax;
		this.vy += this.ay;
		this.x += this.vx;
		this.y += this.vy;

		if (this.y < 0) {
			this.vy *= -1 * wall_particle_res;
			this.y = this.radius;
		} else if (this.y+this.radius > canvas.height) {
			this.vy *= -1 * wall_particle_res;
			this.y = canvas.height - this.radius;
		}

		if (this.x < 0) {
			this.vx *= -1 * wall_particle_res;
			this.x = this.radius;
		} else if (this.x+this.radius > canvas.width) {
			this.vx *= -1 * wall_particle_res;
			this.x = canvas.width - this.radius;
		}
		this.collision();
		this.draw();
	}

	collision() { 
		particles.forEach((particle) => {
			if (particle != this) {
				if (((particle.x-this.x)**2+(particle.y-this.y)**2)**0.5 < this.radius * 2) {
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
	}
}

var preCalcGravity = -9.8
var targetTPS = 60;
var PX_PER_METER = 100;
var GRAVITY = (preCalcGravity * PX_PER_METER) / (targetTPS ** 2);
const wall_particle_res = 0.9;

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
for (let i = 0; i < 50; i++) {
	particles.push(new Particle());
}

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

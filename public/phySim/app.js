"use strict";


const targetFPS = 60;
const PX_PER_METER = 100;
let GRAVITY = (-9.8 * PX_PER_METER) / (targetFPS ** 2);
//GRAVITY = 0;
const wall_particle_res = 0.9;

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
		this.colour = `rgb(${ranInt(0,100)},${ranInt(0,100)},${ranInt(0,100)})`; 
	}
	
	update() {
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

		this.draw();
	}

	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.colour;
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		ctx.fill();
	}
}

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

var particles = [];
for (let i = 0; i < 5; i++) {
	particles.push(new Particle());
}
//var particles = [new Particle()];

//setInterval(update,1000/targetFPS);
update();
function update() {
	ctx.fillStyle = "rgba(255,255,255,0.1)";
	//ctx.fillStyle = "white";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	particles.forEach((particle) => {
		particle.update();
	});
	setTimeout(update,1000/targetFPS);
}

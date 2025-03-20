class Boid {
	constructor(x,y,isMouse) {
		this.x = x;
		this.y = y;
		//this.angle = Math.floor(Math.random()*Math.PI*2);
		this.angle = 0;
		this.vx = 1;
		this.vy = 1;
		this.maxV = 10;
		this.color = `rgb(${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)})`;
		this.isMouse = isMouse;
	}

	update() {
		if (Math.sqrt((this.vy)**2 + (this.vx)**2) > this.maxV) {
			if (this.vy > 0) {
				this.vy -= 0.1;
				//this.vx -= 0.1;
			}
			if (this.vy < 0) {
				this.vy += 0.1;
				//this.vx += 0.1;
			}
			if (this.vx > 0) {
				//this.vy -= 0.1;
				this.vx -= 0.1;
			}
			if (this.vx < 0) {
				//this.vy += 0.1;
				this.vx += 0.1;
			}
		}

		

		

		this.x += this.vx;
		this.y += this.vy;

		this.angle = Math.atan2(this.vy,this.vx);

		if (this.x > 1000) {
			this.x -= 1000
		} else if (this.x < 0) {
			this.x += 1000
		}

		if (this.y > 1000) {
			this.y -= 1000
		} else if (this.y < 0) {
			this.y += 1000
		}
	}

	draw() {
		drawTriangle(this.x,this.y,this.angle+Math.PI/2, this.color)
	}
}


function drawTriangle(x,y,angle, color) {
	ctx.fillStyle = color;
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(angle);

	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(5,20);
	ctx.lineTo(-5,20);
	ctx.lineTo(0,0);
	ctx.stroke();

	ctx.fill()

	ctx.restore();
}

const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;
//var mousedown = false;

addEventListener("mousedown", (event) => {
	boids[0].isMouse = true;
})

addEventListener("mouseup", (event) => {
	boids[0].isMouse = false;
})

addEventListener("mousemove", (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
	boids[0].x = mouseX;
	boids[0].y = mouseY;
});

var boids = [new Boid(mouseX,mouseY,false)];

for (let i = 0; i < 300; i++) {
	boids.push(new Boid(Math.floor(Math.random()*1000),Math.floor(Math.random()*1000),false))
}

var alignmentStrength = 0.5;
var cohesionStrength = 0.4;
var vision = 150;
var collisionDistance = 10;

update()

function update() {
	ctx.clearRect(0,0,1000,1000);
	for (i in boids) {
		boid = boids[i]
		let boidAlignment = 0;
		let centerOfMass = [0,0]
		let numOfBoids = 0;
		for (j in boids) {
			if (i != j) {
				otherBoid = boids[j]
				let offScreenAdjust = [0,-1000,1000]
				for (let i = 0; i < 3; i++) {	
					for (let j = 0; j < 3; j++) {
						if (((boid.x-otherBoid.x + offScreenAdjust[i])**2+(boid.y-otherBoid.y + offScreenAdjust[j])**2)**0.5 < vision) {
							//boidAlignment += Math.atan2((boid.x-otherBoid.x),(boid.y-otherBoid.y))
							boidAlignment += otherBoid.angle;
							centerOfMass[0] += otherBoid.x
							centerOfMass[1] += otherBoid.y
							numOfBoids += 1
							if (otherBoid.isMouse) {
								boidAlignment += otherBoid.angle*4000;
								centerOfMass[0] += otherBoid.x*4000
								centerOfMass[1] += otherBoid.y*4000
							}
							//boid.angle += Math.PI/2
						}

						if (((boid.x-otherBoid.x + offScreenAdjust[i])**2+(boid.y-otherBoid.y + offScreenAdjust[j])**2)**0.5 < collisionDistance) {
							centerOfMass[0] -= otherBoid.x*2;
							centerOfMass[0] -= otherBoid.y*2;
						}
					}
				}
			}
		}
		//boidAlignment = boidAlignment/numOfBoids  + Math.floor(Math.random()*1)*Math.PI - Math.PI*0.5;
		boidAlignment = boidAlignment/numOfBoids
		centerOfMass[0] /= numOfBoids;
		centerOfMass[1] /= numOfBoids;
		if (Math.sqrt((boid.vy)**2 + (boid.vx)**2) < boid.maxV) {
			boid.vx += Math.sin(boidAlignment)*alignmentStrength
			boid.vy += Math.cos(boidAlignment)*alignmentStrength
			boid.vx += (boid.x-centerOfMass[0])*cohesionStrength
			boid.vy += (boid.y-centerOfMass[1])*cohesionStrength
		}
		if (Math.sqrt((boid.vy)**2 + (boid.vx)**2) > boid.maxV) {
			boid.vx -= Math.sin(boidAlignment)*alignmentStrength
			boid.vy -= Math.cos(boidAlignment)*alignmentStrength
			boid.vx -= (boid.x-centerOfMass[0])*cohesionStrength
			boid.vy -= (boid.y-centerOfMass[1])*cohesionStrength
		}
		boid.update()
		//boid.update()
		boid.draw()
	}
	setTimeout(update,1);
}

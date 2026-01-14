Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

class Boid {
	constructor(x,y,isMouse) {
		this.x = x;
		this.y = y;
		this.angle = Math.floor(Math.random()*Math.PI*2);
		this.vx = Math.cos(this.angle)*10;
		this.vy = Math.sin(this.angle)*10;
		this.maxV = 10;
		this.color = `rgb(${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)} ${Math.floor(Math.random()*255)})`;
		this.isMouse = isMouse;
	}

	update() {
		this.x += this.vx
		this.y += this.vy
		this.vx *= 1.1
		this.vy *= 1.1
		if (this.speed() > this.maxV) {
			this.vx *= 100/110
			this.vy *= 100/110
		}
		/*
		if (this.x > canvas.width || this.x < 0) {
			this.setAngle(this.angle + Math.PI)
		}

		if (this.y > canvas.height || this.y < 0) {
			this.setAngle(this.angle + Math.PI)
		}*/
		
		if (this.x > canvas.width) {
			this.x -= canvas.width
		} else if (this.x < 0) {
			this.x += canvas.width
		}
		if (this.y > canvas.width) {
			this.y -= canvas.width
		} else if (this.y < 0) {
			this.y += canvas.width
		}
	}
	updateAngle() {
		this.angle = Math.atan2(this.vy,this.x)
	}
	setAngle(angle) {
		this.angle = angle
		this.vx = Math.cos(this.angle) * this.speed()
		this.vy = Math.sin(this.angle) * this.speed()
	}

	speed() {
		return Math.sqrt(this.vx**2+this.vy**2)
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
	ctx.beginPath();
	ctx.arc(x,y,collisionDistance,0,Math.PI*2,0);
	ctx.stroke();
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
	console.log(event.clientX,event.clientY)
});
var boids = [];

for (let i = 0; i < 300; i++) {
	boids.push(new Boid(Math.floor(Math.random()*canvas.width),Math.floor(Math.random()*canvas.height),false))
}

var alignmentStrength = 1;
var cohesionStrength = 1;
var vision = 150;
var collisionDistance = 10;
var turnSpeed = Math.PI/164




update()

function update() {
	ctx.clearRect(0,0,3000,900);
	for (boid of boids) {
		//boid = boids[i]
		let boidAlignment = 0;
		let centerOfMass = [0,0]
		let numOfBoids = 0;
		boid.color = "rgb(0,255,0)"
		let avoid = false;
		let avoidCoords = [0,0];
		for (otherBoid of boids) {
			//otherBoid = boids[j]
			if (otherBoid != boid) {
				if (((boid.x-otherBoid.x)**2+(boid.y-otherBoid.y)**2)**0.5 < vision) {
					boidAlignment += Math.atan2((boid.x-otherBoid.x),(boid.y-otherBoid.y))
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

				if (((boid.x-otherBoid.x )**2+(boid.y-otherBoid.y )**2)**0.5 < collisionDistance) {
					//centerOfMass[0] -= otherBoid.x*2;
					//centerOfMass[0] -= otherBoid.y*2;
					avoid = true
					boid.color = "rgb(255,0,0)"
					avoidCoords[0] += boid.y-otherBoid.y
					avoidCoords[1] += boid.x-otherBoid.x
				}
			}
		}
		if (numOfBoids > 0) {
			boidAlignment /= numOfBoids;
			centerOfMass[0] /= numOfBoids;
			centerOfMass[1] /= numOfBoids;
			centerOfMass[0] = centerOfMass[0].clamp(150,canvas.width-150)
			centerOfMass[1] = centerOfMass[1].clamp(150,canvas.width-150)
			idealAngle = (Math.atan2(centerOfMass[0],centerOfMass[1])*cohesionStrength + boidAlignment*alignmentStrength)/(cohesionStrength+alignmentStrength)
			avoidCoords[0] /= numOfBoids;
			avoidCoords[1] /= numOfBoids
			if (avoid) {
				idealAngle = Math.atan2(avoidCoords[0],avoidCoords[1])
			}
			angleToTurnBy = idealAngle.clamp(boid.angle-turnSpeed/2,boid.angle+turnSpeed/2)
			boid.setAngle(angleToTurnBy)
		}
		boid.update()
		//boid.update()
		boid.draw()
	}
	setTimeout(update,33);
}

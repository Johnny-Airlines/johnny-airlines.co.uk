class Boid {
	constructor(x,y,angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.vx = 0;
		this.vy = 0;
	}

	update() {
		this.angle = (boidAverageAlignment+Math.atan2(-this.x+boidCenterOfMass[0],-this.y+boidCenterOfMass[1])*4+this.angle)/6;
		//this.angle += (Math.random()*Math.PI/5)-Math.PI/10
		this.x += Math.sin(this.angle)*5;
		this.y += Math.cos(this.angle)*5;

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
		drawTriangle(this.x,this.y,this.angle+Math.PI)
	}
}

function boidUpdate(x,y,angle) {
	let newAngle = (boidAverageAlignment+Math.atan2(-x-boidCenterOfMass[0],y-boidCenterOfMass[1]))/2;
	let newX = x + Math.sin(angle);
	let newY = y + Math.cos(angle);
	return new Boid(newX,newY,newAngle)
}

function drawTriangle(x,y,angle) {
	ctx.save();
	ctx.translate(x,y);
	ctx.rotate(angle);

	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(15,50);
	ctx.lineTo(-15,50);
	ctx.lineTo(0,0);
	ctx.stroke();

	ctx.restore();
}

const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");

var boids = [];

for (let i = 0; i < 3; i++) {
	boids.push(new Boid(Math.floor(Math.random()*1000),Math.floor(Math.random()*1000),0))
}

var boidAverageAlignment = 0;
var boidCenterOfMass = [50,50];
var alginmentTemp;
var centerOfMassTemp = [0,0];

update()

function update() {
	ctx.clearRect(0,0,1000,1000);
	alignmentTemp = 0;
	centerOfMassTemp = [0,0];
	for (i in boids) {
		boid = boids[i]
		alignmentTemp += boid.angle;
		centerOfMassTemp = [centerOfMassTemp[0]+boid.x,centerOfMassTemp[1]+boid.y];
	}
	boidAverageAlignment = alignmentTemp/boids.length;
	boidCenterOfMass = [centerOfMassTemp[0]/boids.length, centerOfMassTemp[1]/boids.length]
	for (i in boids) {
		boid = boids[i]
		boid.update()
		for (j in boids) {
			if (i != j) {
				otherBoid = boids[j]
				if (((boid.x-otherBoid.x)**2+(boid.y-otherBoid.y)**2)**0.5 < 200) {
					boid.angle += Math.atan2((boid.x-otherBoid.x),(boid.y-otherBoid.y))
					//boid.angle += Math.PI/2
				}
			}
		}
		//boid.update()
		boid.draw()
	}
	setTimeout(update,15);
}

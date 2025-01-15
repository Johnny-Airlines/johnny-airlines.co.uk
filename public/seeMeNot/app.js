const ctx = document.getElementById("canvas").getContext('2d')
const bgData = ctx.createImageData(500, 500)

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
for (let i = 0; i < bgData.data.length; i += 4) {
	// Modify pixel data
	bgData.data[i + 0] = getRandomInt(255); // R value
	bgData.data[i + 1] = getRandomInt(255); // G value
	bgData.data[i + 2] = getRandomInt(255); // B value
	bgData.data[i + 3] = 255; // A value
}
const smile = new Image()
smile.src=prompt()
//smile.crossOrigin = "anonymous"
function smileDataFunc() {
	ctx.drawImage(smile,0,0)
	smileData = ctx.getImageData(0,0,500,500)
	return smileData
}
smileDataFunc()
nums = []
for (let i = 0; i < 10000; i++) {
	nums.push(getRandomInt(255))
}
j = 0
paused = true
function draw() {
	newSmileData = smileDataFunc()
	for (let i = 0; i < newSmileData.data.length; i += 4) {
		// Modify pixel data
		if (newSmileData.data[i+2] == 0) {
			newSmileData.data[i + 0] = nums[j]; // R value
			newSmileData.data[i + 1] = nums[j+1]; // G value
			newSmileData.data[i + 2] = nums[j+2]; // B value
			newSmileData.data[i + 3] = 255; // A value
			j += 3
			if (j > 10000) {
				j = 0
			}
		}
		else {
			newSmileData.data[i + 0] = bgData.data[i + 0];
			newSmileData.data[i + 1] = bgData.data[i + 1];
			newSmileData.data[i + 2] = bgData.data[i + 2];
			newSmileData.data[i + 3] = bgData.data[i + 3];
		}
	}
	//console.log(newSmileData)
	//ctx.putImageData(bgData, 0, 0)
	ctx.putImageData(newSmileData,0,0)
	if (!paused) {
	setTimeout(draw,10)
	}
	
}

onkeydown = (event) => {
	paused = !paused
	if (!paused) {
		draw()
	}
}

//draw()

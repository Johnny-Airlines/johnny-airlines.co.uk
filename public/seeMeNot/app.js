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
smile.src = "./smile.png"
smile.crossOrigin = "anonymous"
ctx.drawImage(smile,0,0)
const smileData = ctx.getImageData(0,0,500,500)
function draw() {
	newSmileData = smileData
	for (let i = 0; i < newSmileData.data.length; i += 4) {
		// Modify pixel data
		if (newSmileData.data[i] != 0) {
			newSmileData.data[i + 0] = getRandomInt(255); // R value
			newSmileData.data[i + 1] = getRandomInt(255); // G value
			newSmileData.data[i + 2] = getRandomInt(255); // B value
			newSmileData.data[i + 3] = 255; // A value
		}
	}
	ctx.putImageData(bgData, 0, 0)
	ctx.putImageData(newSmileData,0,0)
}
setInterval(draw(),100)

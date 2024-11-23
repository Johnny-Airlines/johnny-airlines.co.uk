async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
query({"inputs": prompt("")}).then((response) => {
	aiImg.src = URL.createObjectURL(response);
	clearInterval(turning)
	aiImg.style=""
});
let x = 0;
function turn(){
	aiImg.style.transform="rotate("+x+"deg)"
	x+=5
}
const turning = setInterval(turn, 20)
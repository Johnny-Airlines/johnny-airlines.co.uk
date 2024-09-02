async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
		{
			headers: {
				Authorization: "Bearer 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",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}

msgBtnImg = document.getElementById("msg-btn-img")

msgBtnImg.addEventListener("click", img_gen, false)

function img_gen() {
	query({"inputs": document.getElementById("msg-input-img").value}).then((response) => {
		console.log("loading image")
		document.getElementById("image").src = URL.createObjectURL(response);
	});
}

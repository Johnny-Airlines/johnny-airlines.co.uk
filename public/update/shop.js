 
//Database refrences
const db = firebase.database();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadShop();
    } else {
        window.location.href = "https://johnny-airlines.co.uk/accounts.html";
    }
});

var ownedPlanes;

const titleDict = {
    "Plane":"Red",
    "colour_planes/Blue":"Blue",
	"colour_planes/Brown":"Brown",
	"colour_planes/Purple":"Purple",
	"colour_planes/Green":"Green",
	"colour_planes/Grey":"Grey",
	"colour_planes/Pink":"Pink",
	"colour_planes/White":"White",
	"colour_planes/Yellow":"Yellow",
	"Disco":"Disco",
	"Rainbow":"Rainbow",
	"Spitfire":"Spitfire",
	"christmasPlane":"Christmas Plane(2024)",
	"CEO":"CEO",
	"mop":"Mop",
	"LGD":"LGD",
	"purple":"Purple helicopter",
	"invis":"",
	"paper":"Paper Plane",
	"SEC":"Security Plane"
}

const descDict = {
    "Plane":"A red plane, also happens to be the default.",
    "colour_planes/Blue":"A blue plane.",
	"colour_planes/Brown":"A brown plane.",
	"colour_planes/Purple":"A purple plane.",
	"colour_planes/Green":"A green plane.",
	"colour_planes/Grey":"A grey plane.",
	"colour_planes/Pink":"A pink plane.",
	"colour_planes/White":"A white plane.",
	"colour_planes/Yellow":"A yellow plane.",
	"Disco":"A disco plane.",
	"Rainbow":"A rainbow plane.",
	"Spitfire": "A spitfire.",
	"christmasPlane":"The christmas plane from the 2024 christmas event",
	"CEO":"The plane only the CEO gets!!",
	"mop":"For the janitor.",
	"LGD":"The plane only the Lead Graphics Designer gets.",
	"purple":"Purple helicopter.",
	"invis":"",
	"paper":"A paper plane. An absolute classic",
	"SEC":"A plane for head of security"
}

const buttonDict = {
    "Plane":"Owned",
    "colour_planes/Blue":"Buy",
	"colour_planes/Brown":"Buy",
	"colour_planes/Purple":"Buy",
	"colour_planes/Green":"Buy",
	"colour_planes/Grey":"Buy",
	"colour_planes/Pink":"Buy",
	"colour_planes/White":"Buy",
	"colour_planes/Yellow":"Buy",
	"Disco":"Buy",
	"Rainbow":"Buy",
	"Spitfire":"Buy",
	"paper":"Buy",
	"christmasPlane":"Must be found in present",
}

const costDict = {
    "Plane":0,
    "colour_planes/Blue":50,
	"colour_planes/Brown":50,
	"colour_planes/Purple":50,
	"colour_planes/Green":50,
	"colour_planes/Grey":50,
	"colour_planes/Pink":50,
	"colour_planes/White":50,
	"colour_planes/Yellow":52,
	"Disco":100,
	"Rainbow":200,
	"Spitfire":300,
	"paper":500,
	"christmasPlane":"",
}


function loadShop() {
    db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
        let planesInShop = []
		let thing = [...document.getElementById("Planes").children]
		thing.forEach((element) => {
			planesInShop.push(element.src.replace("https://johnny-airlines.co.uk/","").replace("http://localhost:8000/","").replace(".png",""))
		});
		var ownedPlanes = snapshot.val();
        ownedPlanes.forEach((plane) => {
            buttonDict[plane] = "Equip"
			if (!planesInShop.includes(plane)) {
				console.log(plane)
				let planeElement = `<img width="66px" src="https://johnny-airlines.co.uk/${plane}.png" onclick="hoverOverShopItem('${plane}')"/>`
				document.getElementById("Planes").innerHTML += planeElement
			}
        })
    });
    var pfpUrl = firebase.auth().currentUser.photoURL;
    var equipedPlane = pfpUrl.replace("../","")
    var equipedPlane = equipedPlane.replace(".png","")
    buttonDict[equipedPlane] = "Equiped"
}

function hoverOverShopItem(item) {
    loadShop()
    shopItemImg.src = `../${item}.png`
    shopItemTitle.textContent = titleDict[item]
    shopItemDesc.textContent = descDict[item]
	shopBuyButton.textContent = buttonDict[item]
    if (buttonDict[item] == "Buy") {
        shopBuyButton.textContent = "Buy: " + costDict[item]
    } 
}

shopBuyButton.addEventListener("click", buy);
function buy() {
	if (shopBuyButton.innerText.includes("Buy")) {
		var plne = shopItemImg.src
		plne = plne.replace("https://johnny-airlines.co.uk/","")
		plne = plne.replace("http://localhost:8000/","")
		plne = plne.replace(".png","")
		db.ref(`/users/${firebase.auth().currentUser.uid}/tickets`).once("value", (snapshot) => {
			var tickets = snapshot.val()
			if (tickets < costDict[plne]) {
				alert("YOU ARE TOO POOR")
			} else {

				db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
					var ownedPlanes = snapshot.val();
					console.log(ownedPlanes);
					console.log(tickets);
					console.log(plne);
					ownedPlanes.push(plne)
					db.ref(`/users/${firebase.auth().currentUser.uid}/`).update({
						ownedPlanes: ownedPlanes,
						tickets: tickets - costDict[plne]
					})
				});
				loadShop()
				buttonDict[plne] = "Equip"
				hoverOverShopItem(plne)
			}
		})
	}
	else if (shopBuyButton.innerText == "Equip") {
		var plne = shopItemImg.src;
		console.log(plne)
		if (plne.includes("localhost")) {
			plne = plne.replace("http://localhost:8000/","")
		}
		if (plne.includes("https://johnny-airlines.co.uk/")) {
			plne = plne.replace("https://johnny-airlines.co.uk/","")
		}
		console.log(plne)
		firebase.auth().currentUser.updateProfile({
			photoURL: "https://johnny-airlines.co.uk/"+plne,
		});
		alert("Please refresh for your plane to change");
	}
}



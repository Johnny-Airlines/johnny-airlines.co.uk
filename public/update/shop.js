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
	"colour_planes/Yellow":"Yellow"
}

const descDict = {
    "Plane":"A red plane, also happens to be the default.",
    "colour_planes/Blue":"A blue plane.",
	"colour_planes/Brown":"A brown plane.",
	"colour_planes/Dark pink":"A dark pink plane.",
	"colour_planes/Green":"A green plane.",
	"colour_planes/Grey":"A grey plane.",
	"colour_planes/Pink":"A pink plane.",
	"colour_planes/White":"A white plane.",
	"colour_planes/Yellow":"A yellow plane."
}

const buttonDict = {
    "Plane":"Owned",
    "colour_planes/Blue":"Buy",
	"colour_planes/Brown":"Buy",
	"colour_planes/Dark pink":"Buy",
	"colour_planes/Green":"Buy",
	"colour_planes/Grey":"Buy",
	"colour_planes/Pink":"Buy",
	"colour_planes/White":"Buy",
	"colour_planes/Yellow":"Buy"
}

const costDict = {
    "Plane":0,
    "colour_planes/Blue":25,
	"colour_planes/Brown":25,
	"colour_planes/Dark pink":25,
	"colour_planes/Green":25,
	"colour_planes/Grey":25,
	"colour_planes/Pink":25,
	"colour_planes/White":25,
	"colour_planes/Yellow":25
}


function loadShop() {
    db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
        var ownedPlanes = snapshot.val();
        ownedPlanes.forEach((plane) => {
            buttonDict[plane] = "Equip"
        })
    });
    var pfpUrl = firebase.auth().currentUser.photoURL;
    var equipedPlane = pfpUrl.replace("https://johnny-airlines.co.uk/","")
    var equipedPlane = equipedPlane.replace(".png","")
    buttonDict[equipedPlane] = "Equiped"
}

function hoverOverShopItem(item) {
    loadShop()
    shopItemImg.src = `https://johnny-airlines.co.uk/${item}.png`
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
		plne = plne.replace(".png","")
		db.ref(`/users/${firebase.auth().currentUser.uid}/tickets`).once("value", (snapshot) => {
			var tickets = snapshot.val()
			if (tickets < costDict[plne]) {
				alert("YOU ARE TOO POOR, YOU PEASANT")
			} else {

				db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
					var ownedPlanes = snapshot.val();
					ownedPlanes.push(plne)
					firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/`).update({
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
}



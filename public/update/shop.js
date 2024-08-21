firebase.auth().onAuthStateChanged((user) => {

    if (user) {
        loadShop();
    } else {
        window.location.href = "https://johnny-airlines.co.uk/accounts.html";
    }
});

var ownedPlanes;

const titleDict = {
    "Plane":"Default plane",
    "Blue":"Blue",
	"Brown":"Brown",
	"Dark pink":"Dark pink",
	"Green":"Green",
	"Grey":"Grey,
	"Pink":"Pink",
	"Red":"Red",
	"White":"White",
	"Yellow":"Yellow"
}

const descDict = {
    "Plane":"The default plane.",
    "Blue":"A blue plane.",
	"Brown":"A brown plane.",
	"Dark pink":"A dark pink plane.",
	"Green":"A green plane.",
	"Grey":"A grey plane.",
	"Pink":"A pink plane.",
	"Red":"A red plane.",
	"White":"A white plane.",
	"Yellow":"A yellow plane."
}

const buttonDict = {
    "Plane":"Owned",
    "Blue":"Buy",
	"Brown":"Buy",
	"Dark pink":"Buy",
	"Green":"Buy",
	"Grey":"Buy",
	"Pink":"Buy",
	"Red":"Buy",
	"White":"Buy",
	"Yellow":"Buy"
}

const costDict = {
    "Plane":0,
    "Blue":25,
	"Brown":25,
	"Dark pink":25,
	"Green":25,
	"Grey":25,
	"Pink":25,
	"Red":25,
	"White":25,
	"Yellow":25
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
        shopBuyButton.textContent = "Buy: " + costDict["green"]
    } 
}

shopBuyButton.addEventListener("click", buy);
function buy() {
    var plne = shopItemImg.src
    plne = plne.replace("https://johnny-airlines.co.uk/","")
    plne = plne.replace(".png","")
    db.ref(`/users/${firebase.auth().currentUser.uid}/tickets`).on("value", (snapshot) => {
        var tickets = snapshot.val()
        if (tickets < costDict[plne]) {
            alert("YOU ARE TOO POOR, YOU PEASANT")
        } else {
            db.ref(`/users/${firebase.auth().currentUser.uid}/ownedPlanes`).once("value", (snapshot) => {
                var ownedPlanes = snapshot.val();
                ownedPlanes.push(plne)
                firebase.database().ref(`/users/${firebase.auth().currentUser.uid}/`).set({
                    ownedPlanes: ownedPlanes
                })
            });
        }
    })
}



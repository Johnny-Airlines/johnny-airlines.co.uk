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
    "green":"Green"
}

const descDict = {
    "Plane":"The default plane",
    "green":"A green plane"
}

const buttonDict = {
    "Plane":"Owned",
    "green":"Buy"
}

const costDict = {
    "Plane":0,
    "green":25 
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



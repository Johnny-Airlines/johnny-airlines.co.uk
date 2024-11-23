//Set variables to beginner prices or use stored variables
var score = storageCheck("score", 0, false);
var bps = storageCheck("bps", 0, false);
var ubps = {
	"Cursor":0.1,
	"Worker":1,
	"Plantation":8,
	"Mine":47,
    "Factory":260,
    "Country":1400,
    "Planet":4958
}
var upgrades = storageCheck("upgrades",{
	"Cursor":0,
	"Worker":0,
	"Plantation":0,
	"Mine":0,
    "Factory":0,
    "Country":0,
    "Planet":0
}, true);
var cost =  storageCheck("cost",{
	"Cursor":15,
	"Worker":100,
	"Plantation":1100,
	"Mine":12000,
    "Factory":130000,
    "Country":1400000,
    "Planet":200000000
}, true);
//Update the onscreen variable
document.getElementById("score").innerHTML = score;
document.getElementById("bps").innerHTML = bps;
document.getElementById("Cursor").innerHTML = upgrades["Cursor"];
document.getElementById("Worker").innerHTML = upgrades["Worker"];
document.getElementById("Plantation").innerHTML = upgrades["Plantation"];
document.getElementById("Mine").innerHTML = upgrades["Mine"];
document.getElementById("Factory").innerHTML = upgrades["Factory"];
document.getElementById("Country").innerHTML = upgrades["Country"];
document.getElementById("Planet").innerHTML = upgrades["Planet"];
document.getElementById("costCursor").innerHTML = cost["Cursor"];
document.getElementById("costWorker").innerHTML = cost["Worker"];
document.getElementById("costPlantation").innerHTML = cost["Plantation"];
document.getElementById("costMine").innerHTML = cost["Mine"];
document.getElementById("costFactory").innerHTML = cost["Factory"];
document.getElementById("costCountry").innerHTML = cost["Country"];
document.getElementById("costPlanet").innerHTML = cost["Planet"];


//Returns the value of a stored variable, if the variable has no value it sets it to amount
function storageCheck(name, amount, array) {
    if (localStorage.getItem(name) == null && !array) {
        localStorage.setItem(name, amount);
        return localStorage.getItem(name);
    }
    else if (localStorage.getItem(name) == null && array) {
    	localStorage.setItem(name,JSON.stringify(amount));
    	return JSON.parse(localStorage.getItem(name));
    }
    else if (array) {
        return JSON.parse(localStorage.getItem(name));
    }
    else {
    	return localStorage.getItem(name);
    }

}

//Increases amount of clicks by 1 + amount of upgrades
function bClick() {
    score = parseInt(score) + 1;
    localStorage.setItem("score", score);
    document.getElementById("score").innerHTML = score;
}

//Check if the amount of Trains exceeds the score
//If so it increases the amount of upgrades by 1
//Also increases the cost of the next upgrade
//And decreases the amount of Trains
function buyUpgrade(upgrade) {
	upgradeCost = cost[upgrade];
    if (score >= upgradeCost) {
        score -= upgradeCost;
        localStorage.setItem("score", score);
        cost[upgrade] *= 1.15;
        cost[upgrade] = Math.ceil(cost[upgrade]);
        localStorage.setItem("cost", JSON.stringify(cost));
        upgrades[upgrade]++;
        localStorage.setItem("upgrades", JSON.stringify(upgrades));
        bps = parseFloat(bps) + ubps[upgrade];
        localStorage.setItem("bps", bps);
        document.getElementById("score").innerHTML = score;
        document.getElementById("bps").innerHTML = bps;
        document.getElementById(upgrade).innerHTML = upgrades[upgrade];
        document.getElementById("cost" + upgrade).innerHTML = cost[upgrade];
    }
}

//Repeats passiveB every second
setInterval(passiveB, 1000);
function passiveB()
{
	score = parseFloat(score) + parseFloat(bps);
	localStorage.setItem("score", score);
	document.getElementById("score").innerHTML = score;
}

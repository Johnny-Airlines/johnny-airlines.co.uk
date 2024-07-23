//Changes the grids colour
for (var x=0; x < document.getElementsByTagName("grid-item").length; x++) {
	var randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    document.getElementsByTagName("grid-item")[x].style.border = "10px solid " + randomColor;
    document.getElementsByTagName("grid-item")[x].style.backgroundColor = randomColor;
}

//Set variables to beginner prices or use stored variables
var score = storageCheck("score", 0, false);
var bps = storageCheck("bps", 0, false);
var ubps = {
	"Cursor":1,
	"Worker":10,
	"Plantation":50,
	"Mine":100,
    "Factory":500
}
var upgrades = storageCheck("upgrades",{
	"Cursor":0,
	"Worker":0,
	"Plantation":0,
	"Mine":0,
    "Factory":0
}, true);
var cost =  storageCheck("cost",{
	"Cursor":5,
	"Worker":50,
	"Plantation":250,
	"Mine":300,
    "Factory":2000
}, true);
//Update the onscreen variable
document.getElementById("score").innerHTML = score;
document.getElementById("bps").innerHTML = bps;
document.getElementById("Cursor").innerHTML = upgrades["Cursor"];
document.getElementById("Worker").innerHTML = upgrades["Worker"];
document.getElementById("Plantation").innerHTML = upgrades["Plantation"];
document.getElementById("Mine").innerHTML = upgrades["Mine"];
document.getElementById("Factory").innerHTML = upgrades["Factory"];
document.getElementById("costCursor").innerHTML = cost["Cursor"];
document.getElementById("costWorker").innerHTML = cost["Worker"];
document.getElementById("costPlantation").innerHTML = cost["Plantation"];
document.getElementById("costMine").innerHTML = cost["Mine"];
document.getElementById("costFactory").innerHTML = cost["Factory"];

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
        cost[upgrade] *= 1.5;
        cost[upgrade] = Math.floor(cost[upgrade]);
        localStorage.setItem("cost", JSON.stringify(cost));
        upgrades[upgrade]++;
        localStorage.setItem("upgrades", JSON.stringify(upgrades));
        bps = parseInt(bps) + ubps[upgrade];
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
	score = parseInt(score) + parseInt(bps);
	localStorage.setItem("score", score);
	document.getElementById("score").innerHTML = score;
}

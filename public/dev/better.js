const firebaseConfig = {
	apiKey: "AIzaSyDJlncorTA9lATy5t-1bH0OH-lK509ipFw",
	authDomain: "johnnyairlinescouk.firebaseapp.com",
	databaseURL: "https://johnnyairlinescouk-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "johnnyairlinescouk",
	storageBucket: "johnnyairlinescouk.firebasestorage.app",
	messagingSenderId: "682303797708",
	appId: "1:682303797708:web:9d33dce60f9c16c8fe0569",
	measurementId: "G-V3TKRXKCV6"
};
firebase.initializeApp(firebaseConfig);

//Database references
const db = firebase.database();
const userRef = db.ref('users');
const userTableBody = document.getElementById('userTableBody');

//Sign in user
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		var uid = user.uid;
		const displayName = user.displayName;
		const email = user.email.replace("@johnny-airlines.co.uk", "") || prompt("Username: ");
        if (uid != "XSI66btuWOb4LWYkdfrmSUAa4KK2" && uid != "Q4QyRltsO8OdbvxrzlY16xfAw262") {
            window.location.href = "../";
        }
		tables();
	} else {
		//Redirect user to sign in page if not signed in
        firebase.auth().signOut()
		window.location.href = "./signIn.html";
	}
});

const rowsPerPage = 10;
let currentPage = 1;
let totalPages = 100;
let page = 1;
let rawData;
document.getElementById("backPage").disabled = true;

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = hour + ':' + min + ':' + sec + ' ' + date + ' ' + month + ' ' + year;
    return time;
}

function tables() {
	userRef.on('value', (snapshot) => {
		rawData = snapshot.val();
		totalPages = Math.ceil(Object.keys(rawData).length / rowsPerPage);
		renderTable();
	});
}

function renderTable() {
	userTableBody.innerHTML = '';
	const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
	const data = Object.values(rawData).slice(startIndex, endIndex);
	const uids = Object.keys(rawData).slice(startIndex, endIndex);
	for (const user of data) {
		const row = document.createElement('tr');
		const keyCell = document.createElement('td');
		const usernameCell = document.createElement('td');
		const lastLoginCell = document.createElement('td');
		const fuelCell = document.createElement('td');
		const ownedPlanesCell = document.createElement('td');
		const ticketsCell = document.createElement('td');

		keyCell.innerHTML = `<button onclick="editRow(this)">✏️ Edit</button><span>${uids[data.indexOf(user)]}</span>`;
		usernameCell.textContent = JSON.stringify(user.username);
		lastLoginCell.textContent = timeConverter(user.lastLogin);
		lastLoginCell.style = "font-size:10px";
		fuelCell.textContent = JSON.stringify(user.fuel);
		for (const plane of user.ownedPlanes) {
			ownedPlanesCell.innerHTML += `<img src="../${plane}.png" alt="${plane}" title="${plane}" style="width:30px;height:30px;margin-right:5px;">`;
		}
		ticketsCell.textContent = JSON.stringify(user.tickets);

		row.appendChild(keyCell);
		row.appendChild(usernameCell);
		row.appendChild(lastLoginCell);
		row.appendChild(ticketsCell);
		row.appendChild(fuelCell);
		row.appendChild(ownedPlanesCell);
		userTableBody.appendChild(row);
	};
}

function forwardPage() {
	page += 1;
	renderTable();
	document.getElementById("backPage").disabled = false;
	if (page == totalPages) {
		document.getElementById("forwardPage").disabled = true;
	}
}

function backPage() {
	page -= 1;
	renderTable();
	document.getElementById("forwardPage").disabled = false;
	if (page == 1) {
		document.getElementById("backPage").disabled = true;
	}
}

function searchUser() {
	const searchInput = document.getElementById("searchInput").value;
	let foundUser = false;
	for (const uid in rawData) {
		if (rawData[uid].username === searchInput) {
			foundUser = true;
			page = Math.ceil(Object.keys(rawData).indexOf(uid) / rowsPerPage);
			document.getElementById("forwardPage").disabled = false;
			document.getElementById("backPage").disabled = false;
			if (page == 1) {
				document.getElementById("backPage").disabled = true;
			}
			if (page == totalPages) {
				document.getElementById("forwardPage").disabled = true;
			}
			renderTable();
			break;
		}
	}
	if (!foundUser) {
		alert("User not found");
	}
}

function editRow(button) {
	const row = button.parentElement.parentElement;
	const cells = row.querySelectorAll('td');
	const ticketsCell = cells[3];
	const fuelCell = cells[4];
	ticketsCell.innerHTML = `<input type="number" value="${ticketsCell.textContent.replace(/"/g, '')}">`;
	fuelCell.innerHTML = `<input type="number" value="${fuelCell.textContent.replace(/"/g, '')}">`;
	button.innerHTML = '💾 Save';
	button.onclick = () => saveRow(button);
}

function saveRow(button) {
	const row = button.parentElement.parentElement;
	const cells = row.querySelectorAll('td');
	const uid = cells[0].querySelector('span').textContent;
	const ticketsInput = cells[3].querySelector('input');
	const fuelInput = cells[4].querySelector('input');
	const newTickets = parseInt(ticketsInput.value);
	const newFuel = parseInt(fuelInput.value);
	userRef.child(uid).update({
		tickets: newTickets,
		fuel: newFuel
	});
	cells[3].textContent = newTickets;
	cells[4].textContent = newFuel;
	button.innerHTML = '✏️ Edit';
	button.onclick = () => editRow(button);
}
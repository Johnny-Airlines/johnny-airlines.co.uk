import firebaseConfig from "../fConfig.js"
firebase.initializeApp(firebaseConfig);
sessionStorage.clear();

// Database reference
const db = firebase.database();
const dataRef = db.ref('users'); // Replace 'example' with your desired database reference

// Read data and populate the table
dataRef.on('value', (snapshot) => {
	const tableBody = document.querySelector('#msgs tbody');
	tableBody.innerHTML = '';

	snapshot.forEach((childSnapshot) => {
		const row = document.createElement('tr');
		const keyCell = document.createElement('td');
		const usernameCell = document.createElement('td')
		const fuelCell = document.createElement('td');
		const ownedPlanesCell = document.createElement('td');
		const ticketsCell = document.createElement('td');
		const editInputFuel = document.createElement('input');
		const editInputPlanes = document.createElement('input');
		const editInputTickets = document.createElement('input');

		keyCell.textContent = childSnapshot.key;
		usernameCell.textContent = JSON.stringify(childSnapshot.val()["username"])

		// FUEL
		fuelCell.textContent = JSON.stringify(childSnapshot.val()["fuel"]);
		editInputFuel.type = 'text';
		editInputFuel.value = JSON.stringify(childSnapshot.val()["fuel"]);
		editInputFuel.style = "width:100%"
		editInputFuel.style.display = 'none';

		// Add event listener for editing
		fuelCell.addEventListener('click', () => {
			fuelCell.style.display = 'none';
			editInputFuel.style.display = 'inline-block';
			editInputFuel.focus();
		});

		// Add event listener for saving changes
		editInputFuel.addEventListener('blur', () => {
			fuelCell.style.display = 'inline-block';
			editInputFuel.style.display = 'none';
			dataRef.child(childSnapshot.key).child("fuel").set(JSON.parse(editInputFuel.value));
		});


		// PLANES
		ownedPlanesCell.textContent = JSON.stringify(childSnapshot.val()["ownedPlanes"])
		editInputPlanes.type = "text";
		editInputPlanes.value = JSON.stringify(childSnapshot.val()["ownedPlanes"])
		editInputPlanes.style= "width:100%";
		editInputPlanes.style.display = "none";

		// Add event listener for editing
		ownedPlanesCell.addEventListener('click', () => {
			ownedPlanesCell.style.display="none";
			editInputPlanes.style.display="inline-block";
			editInputPlanes.focus();
		});

		// Add event listener for saving changes
		editInputPlanes.addEventListener('blur', () => {
			ownedPlanesCell.style.display = 'inline-block';
			editInputPlanes.style.display = 'none';
			editInputPlanes.style.width = "100%";
			ownedPlanesCell.style.width="100%";
			dataRef.child(childSnapshot.key).child("ownedPlanes").set(JSON.parse(editInputPlanes.value));
		});

		// TICKETS
		ticketsCell.textContent = JSON.stringify(childSnapshot.val()["tickets"])
		editInputTickets.type = "text";
		editInputTickets.value = JSON.stringify(childSnapshot.val()["tickets"])
		editInputTickets.style = "width:100%";
		editInputTickets.style.display = "none";

		// Add event listener for editing
		ticketsCell.addEventListener('click', () => {
			ticketsCell.style.display = 'none';
			editInputTickets.style.display = 'inline-block';
			editInputTickets.focus();
		});

		// Add event listener for saving changes
		editInputTickets.addEventListener('blur', () => {
			ticketsCell.style.display = 'inline-block';
			editInputTickets.style.display = 'none';
			dataRef.child(childSnapshot.key).child('tickets').set(JSON.parse(editInputTickets.value));
		});

		row.appendChild(keyCell);
		row.appendChild(usernameCell);
		row.appendChild(ticketsCell);
		row.appendChild(editInputTickets);
		row.appendChild(fuelCell);
		row.appendChild(editInputFuel);
		row.appendChild(ownedPlanesCell);
		row.appendChild(editInputPlanes);
		tableBody.appendChild(row);
	});
});

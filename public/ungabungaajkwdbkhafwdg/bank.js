import firebaseConfig from "../fConfig.js"
firebase.initializeApp(firebaseConfig);

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
    const valueCell = document.createElement('td');
    const editInput = document.createElement('input');

    keyCell.textContent = childSnapshot.key;
    valueCell.textContent = JSON.stringify(childSnapshot.val());
    editInput.type = 'text';
    editInput.value = JSON.stringify(childSnapshot.val());
    editInput.style = "width:100%"
    editInput.style.display = 'none';

    // Add event listener for editing
    valueCell.addEventListener('click', () => {
      valueCell.style.display = 'none';
      editInput.style.display = 'inline-block';
      editInput.focus();
    });

    // Add event listener for saving changes
    editInput.addEventListener('blur', () => {
      valueCell.style.display = 'inline-block';
      editInput.style.display = 'none';
      dataRef.child(childSnapshot.key).set(JSON.parse(editInput.value));
    });

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    row.appendChild(editInput);
    tableBody.appendChild(row);
  });
});
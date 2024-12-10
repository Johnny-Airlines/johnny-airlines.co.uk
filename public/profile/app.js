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
const db = firebase.database();
var uid = "";
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var uid = user.uid;
        const email = user.email;
        document.getElementById("username").innerHTML = "Username: " + email.replace("@johnny-airlines.co.uk",""); 
        let displayName = user.displayName;
        if (!displayName) {
            user.updateProfile({
                displayName: email.replace("@johnny-airlines.co.uk","") 
            }).then(() => {
                console.log('User display name updated to default name');
            }).catch(error => {
                console.error('Error updating user display name:', error);
            });
        }
        displayName = user.displayName;
        document.getElementById('disname').innerHTML = "Display Name: " + displayName;
        let photoURL = user.photoURL;
        if (!photoURL){
            user.updateProfile({
				photoURL: 'https://johnny-airlines.co.uk/Plane.png'
            }).then(() => {
                console.log('User profile picture updated to default image');
            }).catch(error => {
                console.error('Error updating user profile picture:', error);
            });
        }
        photoURL = user.photoURL;
        document.getElementById("pfp").src = photoURL;
        const fetchTicket = db.ref('tickets/' + uid);
        async function getTickets() {
            const dbRef = firebase.database().ref('users/' + uid + '/tickets');
            const snapshot = await dbRef.once('value');
            const clicks = snapshot.val();
            return clicks;
        }
        getTickets().then(tickets => {
            if (tickets == null) {
                db.ref('users/' + uid).set({
                    tickets: 0,
                    username: email.replace("@johnny-airlines.co.uk",""),
					ownedPlanes:["Plane"],
					fuel: 100,
                })
            }
            else {
                document.getElementById('tickets').innerHTML = 0;
            }
            document.getElementById('tickets').innerHTML = tickets;
        });
        let disname = document.getElementById('disname');
        disname.addEventListener('click',()=>{
            let newName = prompt("")
            disname.innerHTML = "Display Name: " + newName;
            user.updateProfile({
                displayName: newName
            }).then(() => {
                console.log('User display name updated to new display name');
            }).catch(error => {
                console.error('Error updating user display name:', error);
            });

        })
    } else {
        console.log("not signed in")
    }
});



function signOut() {
    firebase.auth().signOut().then(() => {
        location.replace("/accounts.html")
    }).catch((error) => {
        console.log(error);
    });
}

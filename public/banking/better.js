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


//Sign in user
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		var uid = user.uid;
		const displayName = user.displayName;
		const email =
			user.email.replace("@johnny-airlines.co.uk", "") || prompt("Username: ");
        if (uid != "XSI66btuWOb4LWYkdfrmSUAa4KK2" && uid != "Q4QyRltsO8OdbvxrzlY16xfAw262") {
            window.location.href = "../";
        }
	} else {
		//Redirect user to sign in page if not signed in
        firebase.auth().signOut()
		window.location.href = "./signIn.html";
	}
});
const firebaseConfig = {
    apiKey: "AIzaSyDKbitwgQax-642jBB3VW221hgtIEBHag4",
    authDomain: "movieticket-93217.firebaseapp.com",
    databaseURL: "https://movieticket-93217-default-rtdb.firebaseio.com",
    projectId: "movieticket-93217",
    storageBucket: "movieticket-93217.firebasestorage.app",
    messagingSenderId: "1089839481398",
    appId: "1:1089839481398:web:d0253f153f6c9b601b0e97"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", function() {
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');

    if (registerBtn) {
        registerBtn.addEventListener("click", function() {
            const user_name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const password = document.getElementById('user-password').value;
            localStorage.setItem("user_name", user_name);
            localStorage.setItem("email", email);

            auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                alert("Registration Successful! Welcome " + userCredential.user.email);
                window.location.href = "event_selection.html";
            })
            .catch(error => {
                alert(error.message);
            });
        });
    }

    if(loginBtn) {
        loginBtn.addEventListener("click", function() {
            const user_name = document.getElementById("user-name").value;
            const email = document.getElementById("user-email").value;
            const password = document.getElementById("user-password").value;

            localStorage.setItem("user_name", user_name);
            localStorage.setItem("email", email);
            
            auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                alert("Login Successful! Welcome Back " + userCredential.user.email);
                window.location.href = "event_selection.html";
            })
            .catch(error => {
                alert(error.message);
            });
        });
    }
})
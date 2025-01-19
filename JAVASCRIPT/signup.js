window.onload = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        document.getElementById("signUp").style.display = "none";
        document.getElementById("header").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("mainDiv").style.display = "block";
    } else {
        document.getElementById("signUp").style.display = "block";
        document.getElementById("header").style.display = "block";
        document.getElementById("login").style.display = "none";
        document.getElementById("mainDiv").style.display = "none";
    }
};

function onSignup() {
    const useremail = document.getElementById("email").value;
    const userpassword = document.getElementById("password").value;

    localStorage.setItem("useremail", useremail);
    localStorage.setItem("userpassword", userpassword);
    localStorage.setItem("isLoggedIn", "true");

    document.getElementById("signUp").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("mainDiv").style.display = "block";
}

function onLogin() {
    const useremail = document.getElementById("loginEmail").value;
    const userpassword = document.getElementById("loginPassword").value;

    const storedUseremail = localStorage.getItem("useremail");
    const storedUserpassword = localStorage.getItem("userpassword");

    if (useremail === storedUseremail && userpassword === storedUserpassword) {
        localStorage.setItem("isLoggedIn", true);

        document.getElementById("signUp").style.display = "none";
        document.getElementById("header").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("mainDiv").style.display = "block";
    } else {
        alert("Invalid username or password!");
    }
}

function showSignupForm() {
    document.getElementById("signUp").style.display = "block";
    document.getElementById("header").style.display = "block";
    document.getElementById("login").style.display = "none";
    document.getElementById("mainDiv").style.display = "name";
}
function showLoginForm() {
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("mainDiv").style.display = "name";
}

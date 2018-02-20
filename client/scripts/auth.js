import * as http from "./http-utils";

window.addEventListener('load', init);

const server = "http://localhost:5000";

function init() {
    let signinButton = document.getElementById("signin");
    let registerButton = document.getElementById("register");

    if (signinButton) {
        signinButton.addEventListener('click', signin)
    }
    else if (registerButton) {
        registerButton.addEventListener('click', register);
    }


}

function signin() {
    authenticate()
        .then((data) => {
            document.cookie = "user_id=" + data.user_id;
            displayAdminPage()
        })
        .catch((e) => console.error(e))
}


function register() {
    createUser()
        .then((data) => {
            document.cookie = "user_id=" + data.user_id;
            displayAdminPage();
        })
        .catch((e) => console.error(e))
}


function createUser() {
    const url_new = server + '/users';
    const newUserCredentials = getUserCredentials();
    return http.makePostRequest(url_new, newUserCredentials);
}

function displayAdminPage() {
    window.location.replace('./admin.html');
}


function authenticate() {
    const url_auth = server + '/session';
    const userCredentials = getUserCredentials();
    return http.makePostRequest(url_auth, userCredentials);
}


function getUserCredentials() {
    return {"email": getEmail(), "password": getPassword()};
}


function getEmail() {
    return document.getElementById("email").value;

}


function getPassword() {
    return document.getElementById("password").value;
}


function getConfirmedPassWord() {
    return document.getElementById("confirmed-password").value;
}



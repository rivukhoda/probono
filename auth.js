window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', signin);
}

function signin() {
    authenticate()
        .then(() => displayAdminPage())
        .catch((e) => console.error(e))
}


function register() {
    createUser()
        .then(() => displayAdminPage())
        .catch((e) => console.error(e))
}




function createUser() {
    const url_new = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";
    const newUserCredentials = getUserCredentials();
    return makePostRequest(url_new, newUserCredentials);
}

function displayAdminPage() {
    window.location.replace('./admin.html');
}


function authenticate() {
    const url_auth = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";
    const userCredentials = getUserCredentials();
    return makePostRequest(url_auth, userCredentials);
}


function getUserCredentials() {
   return {"email" : getEmail(), "password": getPassword()};
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



function makePostRequest(url, data) {
    return new Promise(
        function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                var json = JSON.parse(xhr.responseText);
                resolve(json);
            };
            xhr.onerror = function () {
                reject(xhr.statusText);
            };
            xhr.send(JSON.stringify(data));

        }
    )


}
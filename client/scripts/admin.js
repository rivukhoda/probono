window.addEventListener('load', init);

function init() {
    document.getElementById('button').addEventListener('click', addList);
    displayLists();
}

const server = "http://localhost:5000";
const url_lists = server + "/lists";


function addList() {
    let listTitle = getListTitle();
    createList(url_lists, listTitle)
        .then(() => displayLists())
        .catch((e) => console.error(e))
}

function getListTitle() {
    return document.getElementById("title").value;
}


function createList(url, data) {
    const newList = {"name": data, "user_id": getCookie("user_id")};
    return makePostRequest(url, newList);
}

function removeList(event) {
    const listId = event.target.parentNode.getAttribute("id");
    deleteList(listId)
        .then(() => event.target.parentNode.remove())
        .catch((e) => console.error(e))
}


function deleteList(listId) {
    const url_delete = server + "/lists/" + listId;
    return makeDeleteRequest(url_delete);

}

function displayLists() {
    getLists().then((data) => {
        for (var i = 0; i < data["lists"].length; i++) {
            displayList(data["lists"][i]);
        }
    }).catch(function (e) {
        console.log(e);
    })
}


function getLists() {
    const url = url_lists + '?id=' + getCookie("user_id");
    return makeGetRequest(url);
}

function makeGetRequest(url) {
    return new Promise(
        function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                var json = JSON.parse(xhr.responseText);
                resolve(json);
            };
            xhr.onerror = function () {
                reject(xhr.statusText);
            };
            xhr.send();

        }
    )
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

function makeDeleteRequest(url) {
    return new Promise(
        function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                var json = JSON.parse(xhr.responseText);
                resolve(json);
            };
            xhr.onerror = function () {
                reject(xhr.statusText);
            };
            xhr.send();

        }
    )
}


function displayList(list) {
    var newContent = document.createTextNode(list.name);
    var link = document.createElement("a");
    link.appendChild(newContent);
    link.setAttribute("href", "./index.html?id="+list.id);

    let removeButton = document.createElement("button");
    let removeIcon = document.createTextNode("x");
    removeButton.appendChild(removeIcon);
    removeButton.addEventListener('click', removeList);

    var newLi = document.createElement("li");
    newLi.setAttribute("id", list.id);
    newLi.appendChild(removeButton);
    newLi.appendChild(link);


    document.getElementById("list").appendChild(newLi);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
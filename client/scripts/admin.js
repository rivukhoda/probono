import * as http from "./http-utils";

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
    return http.makePostRequest(url, newList);
}

function removeList(event) {
    const listId = event.target.parentNode.getAttribute("id");
    deleteList(listId)
        .then(() => event.target.parentNode.remove())
        .catch((e) => console.error(e))
}


function deleteList(listId) {
    const url_delete = server + "/lists/" + listId;
    return http.makeDeleteRequest(url_delete);

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
    return http.makeGetRequest(url);
}


function displayList(list) {
    var newContent = document.createTextNode(list.name);
    var link = document.createElement("a");
    link.appendChild(newContent);
    link.setAttribute("href", "./main.html?id=" + list.id);

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
    for (var i = 0; i < ca.length; i++) {
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
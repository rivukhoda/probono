window.addEventListener('load', init);

function init() {
    document.getElementById('button').addEventListener('click', addList);
    displayLists();
}

const url_get = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
const url_post = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";

function formDeleteUrl(id) {
    return "https://my.api.mockaroo.com/deleteresponse/" + id + ".json?key=835b6af0";

}


function addList() {
    let listTitle = getListTitle();
    createList(url_post, listTitle)
        .then(() => displayList(listTitle))
        .catch((e) => console.error(e))
}

function getListTitle() {
    return document.getElementById("title").value;
}


function createList(url, data) {
    return makePostRequest(url, data);
}

function removeList(event) {
    deleteList("123")
        .then(() => event.target.parentNode.remove())
        .catch((e) => console.error(e))
}


function deleteList(listId) {
    const url_delete = formDeleteUrl(listId);
    return makeDeleteRequest(url_delete);

}

function displayLists() {
    getLists().then(function (lists) {
        for (var i = 0; i < lists.length; i++) {
            displayList(lists[i].description);
        }
    }).catch(function (e) {
        console.log(e);
    })
}


function getLists() {
    return makeGetRequest(url_get);
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


function displayList(description) {
    var newContent = document.createTextNode(description);
    var link = document.createElement("a");
    link.appendChild(newContent);
    link.setAttribute("href", "");

    let removeButton = document.createElement("button");
    let removeIcon = document.createTextNode("x");
    removeButton.appendChild(removeIcon);
    removeButton.addEventListener('click', removeList);

    var newLi = document.createElement("li");
    newLi.appendChild(removeButton);
    newLi.appendChild(link);


    document.getElementById("list").appendChild(newLi);
}
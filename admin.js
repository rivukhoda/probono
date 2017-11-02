window.addEventListener('load', init);

function init() {
    document.getElementById('button').addEventListener('click', addList);
    displayLists();
}

const url_get = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
const url_post = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";

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

function deleteList() {
    var url;

}

function displayLists() {
    getLists(url_get).then(function (lists) {
        for (var i = 0; i < lists.length; i++) {
            displayList(lists[i].description);
        }
    }).catch(function (e) {
        console.log(e);
    })
}


function getLists(url) {
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

function displayList(description) {
    var newContent = document.createTextNode(description);
    var link = document.createElement("a");
    link.appendChild(newContent);
    link.setAttribute("href", "");
    var newLi = document.createElement("li");
    newLi.appendChild(link);

    document.getElementById("list").appendChild(newLi);
}
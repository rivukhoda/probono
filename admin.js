window.addEventListener('load', init);

function init() {
    displayLists();
}

const url = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";

function createList(url) {

}

function deleteList() {
    var url;

}

function displayLists() {
    getLists(url).then(function (lists) {
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
    var label = document.createElement("label");
    label.appendChild(newContent);
    var newLi = document.createElement("li");
    newLi.appendChild(label);

    document.getElementById("list").appendChild(newLi);
}
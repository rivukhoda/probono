window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', addItem);
    displayItems();
}


//function addItem() {
//    var userInput = document.getElementById("input");
//    var newContent = document.createTextNode(userInput.value);
//
//    var checkBox = document.createElement("input");
//    checkBox.setAttribute("type", "checkbox");
//    checkBox.addEventListener('change', removeItem);
//
//    var label = document.createElement("label");
//    label.appendChild(newContent);
//
//    var newLi = document.createElement("li");
//    newLi.appendChild(checkBox);
//    newLi.appendChild(label);
//
//    document.getElementById("list").appendChild(newLi);
//    userInput.value = "";
//
//}

function addItem(description) {
    var newContent = document.createTextNode(description);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener('change', removeItem);

    var label = document.createElement("label");
    label.appendChild(newContent);

    var newLi = document.createElement("li");
    newLi.appendChild(checkBox);
    newLi.appendChild(label);

    document.getElementById("list").appendChild(newLi);

}


function removeItem(event) {
    event.target.parentNode.remove();
}

function editItem() {

}

function createTask() {
    var data = {
        "name": getName(),
        "email": getEmail(),
        "description": getDescription(),
        "timeEstimate": getTimeEstimate(),
        "dueDate": getDueDate()
    };

    var url;
    makePostRequest(data);
}

function displayItems() {

    var promisedTasks = getTasks();
    promisedTasks.then(
        function (tasks) {
            for (var i = 0; i < tasks.length; i++) {
                addItem(tasks[i].description);
            }
        }
    ).catch(function(e) {
        console.log(e);
    })
}

function getTasks() {
    var url = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
    return makeGetRequest(url);
}

function getDescription() {
    return document.getElementById("input");
}

function getEmail() {
    return document.getElementById("email");

}

function getName() {
    return document.getElementById("name");

}

function getTimeEstimate() {
    return document.getElementById("number");
}

function getDueDate() {
    return document.getElementById("date");
}

function setWaitTime() {

}

function makePostRequest(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    xhr.send(JSON.stringify(data));
}

function makeGetRequest(url) {
    return new Promise(
        function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            //xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                var json = JSON.parse(xhr.responseText);
                resolve(json);
            };
            xhr.onerror = function() {
                reject(xhr.statusText);
            };
            xhr.send();

        }
    )

}
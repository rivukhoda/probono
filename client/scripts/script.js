window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', addItem);
    const givenTasks = getTasks();

    givenTasks
        .then((tasks) => displayItems(tasks))
        .catch((e) => console.log(e));

    displayStats(givenTasks);

}

function displayStats(givenTasks) {
    givenTasks
        .then((tasks) => computeTotalEstimatedWaitTime(tasks))
        .then((ewt) => displayEstimatedWaitTime(ewt))
        .catch((e) => console.error(e));

    givenTasks
        .then((tasks) => computeTotalNumberOfTasks(tasks))
        .then((numberOfTasks) => displayTotalNumberOfTasks(numberOfTasks))
        .catch((e) => console.error(e));
}

function checkItemOwner() {
    var userId = prompt("Please enter your email");
    return authenticate(userId);
}


function authenticate(userId) {
    const url_auth = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";
    return makePostRequest(url_auth, userId);
}


function removeItem(event) {
    checkItemOwner()
        .then(() => {
            deleteTask("123")
                .then(() => event.target.parentNode.remove())
                .catch((e) => console.log(e));
        })
        .catch((e) => {
            window.alert("Your credentials are not correct, please try again.");
            console.log(e);
        })
}


function deleteTask(taskId) {
    var url = "https://my.api.mockaroo.com/deleteresponse/" + taskId + ".json?key=835b6af0";
    return makeDeleteRequest(url);
}


function displayItems(tasks) {
    for (var i = 0; i < tasks.length; i++) {
        displayItem(tasks[i].description);
    }
}


function displayItem(description) {
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

function getTasks() {
    var url = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
    return makeGetRequest(url);
}

function addItem() {
    var todo = createItem();
    createTask(todo).then(
        function () {
            displayItem(todo.description);
        }
    ).catch(function (e) {
        console.log(e);
    })


}

function createTask(data) {
    var url = "https://my.api.mockaroo.com/createresponse.json?key=835b6af0";
    return makePostRequest(url, data);
}

function createItem() {
    var item = {
        "name": getName(),
        "email": getEmail(),
        "description": getDescription(),
        "timeEstimate": getTimeEstimate(),
        "dueDate": getDueDate()
    };
    return item;
}

function getDescription() {
    return document.getElementById("input").value;
}

function getEmail() {
    return document.getElementById("email").value;

}

function getName() {
    return document.getElementById("name").value;

}

function getTimeEstimate() {
    return document.getElementById("number").value;
}

function getDueDate() {
    return document.getElementById("date").value;
}

function computeTotalEstimatedWaitTime(tasks) {

    let totalEstimatedWaitTime = 0;
    for (let task of tasks) {
        totalEstimatedWaitTime += task.timeEstimate;
    }
    return totalEstimatedWaitTime;
}

function displayEstimatedWaitTime(ewt) {
    let twetNode = document.createTextNode(ewt + ' hours');
    let elem = document.getElementById('wait-time');
    elem.appendChild(twetNode);

}
function computeTotalNumberOfTasks(tasks) {
    return tasks.length;
}


function displayTotalNumberOfTasks(numberOfTasks) {
    let node = document.createTextNode(numberOfTasks + ' items');
    let elem = document.getElementById("total-tasks");
    elem.appendChild(node);

}

function getTotalRequestsCompleted() {
    let url = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
    return makeGetRequest(url);
}

function displayTotalRequestsCompleted() {
    let node = document.createTextNode(trc);
    let elem = document.getElementById('total-requests');
    elem.appendChild(node);
}

function getTotalWorkedHours() {
    let url = "https://my.api.mockaroo.com/tasks.json?key=835b6af0";
    return makeGetRequest(url);
}

function displayTotalWorkedHours() {
    let node = document.createTextNode(twh);
    let elem = document.getElementById('total-hours');
    elem.appendChild(node);
}

function editItem() {


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
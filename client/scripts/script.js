window.addEventListener('load', init);

const server = "http://localhost:5000";
let storedTasks = [];
const params = new URLSearchParams(location.search.slice(1));

function init() {
    document.getElementById("button").addEventListener('click', addItem);
    displayUIStates();

}

function displayUIStates() {
    let givenTasks = getTasks();

    givenTasks
        .then((tasks) => displayItems(tasks))
        .catch((e) => console.log(e));

    displayStats(givenTasks);

    givenTasks
        .then((data) => storedTasks = data);


}

function displayStats(givenTasks) {
    givenTasks
        .then((data) => computeTotalEstimatedWaitTime(data['tasks']))
        .then((ewt) => displayEstimatedWaitTime(ewt))
        .catch((e) => console.error(e));

    givenTasks
        .then((data) => computeTotalNumberOfTasks(data['tasks']))
        .then((numberOfTasks) => displayTotalNumberOfTasks(numberOfTasks))
        .catch((e) => console.error(e));
}

function checkItemOwner(taskId) {
    var email = prompt("Please enter your email");
    return authenticate({"email": email, "task_id": taskId});
}


function authenticate(data) {
    const url_auth = server + "/auth";
    return makePutRequest(url_auth, data)
        .then((response) => {
            if (response.status == "400") {
                throw response.message;
            }
        });
}

function uncheckItem(id) {
    document.getElementById(id).firstElementChild.checked = false;
}


function removeItem(event) {
    const taskId = event.target.parentNode.getAttribute("id");
    checkItemOwner(taskId)
        .then(() => {
            deleteTask(taskId)
                .then(() => event.target.parentNode.remove())
                .catch((e) => console.log(e));
        })
        .catch((e) => {
            uncheckItem(taskId);
            window.alert("Your credentials are not correct, please try again.");
            console.error(e);
        })
}


function deleteTask(taskId) {
    const url_delete = server + '/tasks/' + taskId;
    return makeDeleteRequest(url_delete);
}


function displayItems(data) {
    document.getElementById("list").innerHTML = '';
    for (var i = 0; i < data["tasks"].length; i++) {
        displayItem(data["tasks"][i]);
    }
}

function formatDate(date) {
    var parsedDate = new Date(date);
    return parsedDate.getMonth() + "/" + parsedDate.getDate() + "/" + parsedDate.getFullYear();



}


function displayItem(item) {


    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener('change', removeItem);


    var label = document.createElement("label");
    var newContent = document.createTextNode(item.description);
    label.appendChild(newContent);

    var span = document.createElement("span");
    var date = document.createTextNode(formatDate(item.due_date));
    span.appendChild(date);

    var newLi = document.createElement("li");
    newLi.setAttribute("id", item.id);
    newLi.appendChild(checkBox);
    newLi.appendChild(label);
    newLi.appendChild(date);

    document.getElementById("list").appendChild(newLi);

}

function getTasks() {
    const url_tasks = server + '/tasks?list_id=' + params.get("id");
    return makeGetRequest(url_tasks);
}

function addItem() {
    var todo = createItem();
    createTask(todo).then(
        function () {
            displayUIStates();
        }
    ).catch(function (e) {
        console.log(e);
    })


}

function createTask(data) {
    const url_create = server + "/tasks";
    return makePostRequest(url_create, data);
}

function createItem() {
    var item = {
        "requester": getName(),
        "email": getEmail(),
        "description": getDescription(),
        "time_frame": getTimeEstimate(),
        "due_date": getDueDate(),
        "list_id": params.get("id")
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
        totalEstimatedWaitTime += task.time_frame;
    }
    return totalEstimatedWaitTime;
}

function displayEstimatedWaitTime(ewt) {
    let twetNode = document.createTextNode(ewt + ' hours');
    let elem = document.getElementById('wait-time');
    elem.innerHTML = 'Estimated wait time: ';
    elem.appendChild(twetNode);

}

function computeTotalNumberOfTasks(tasks) {
    return tasks.length;
}


function displayTotalNumberOfTasks(numberOfTasks) {
    let node = document.createTextNode(numberOfTasks + ' items');
    let elem = document.getElementById("total-tasks");
    elem.innerHTML = 'Total number of requests: ';
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

function makePutRequest(url, data) {
    return new Promise(
        function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);
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
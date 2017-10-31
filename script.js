window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', addItem);
    displayItems();
    displayTotalNumberOfTasks();
}

function checkItemOwner() {
    var userId = prompt("Please enter your email");
}


function removeItem(event) {
    deleteTask("123").then(
        function () {
            event.target.parentNode.remove()
        }
    ).catch(function (e) {
        console.log(e);
    })

}

function deleteTask(taskId) {
    var url = "https://my.api.mockaroo.com/deleteresponse/" + taskId + ".json?key=835b6af0";
    return makeDeleteRequest(url);
}


function displayItems() {

    getTasks().then(
        function (tasks) {
            for (var i = 0; i < tasks.length; i++) {
                displayItem(tasks[i].description);
            }
        }
    ).catch(function (e) {
        console.log(e);
    })
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

function setWaitTime() {

}

function displayTotalNumberOfTasks() {
    var elem = document.getElementById("total-tasks");
    var total = 0;

    getTasks().then(
        function (tasks) {
            for (var i = 0; i < tasks.length; i++) {
                total += tasks[i].timeEstimate;
            }
            elem.value = total;
        }
    ).catch(function (e) {
        console.log(e);
    })


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
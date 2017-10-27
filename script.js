window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', addItem);
}


function addItem() {
    var userInput = document.getElementById("input");
    var newContent = document.createTextNode(userInput.value);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener('change', removeItem);

    var label = document.createElement("label");
    label.appendChild(newContent);

    var newLi = document.createElement("li");
    newLi.appendChild(checkBox);
    newLi.appendChild(label);

    document.getElementById("list").appendChild(newLi);
    userInput.value = "";

}

function removeItem(event) {
    event.target.parentNode.remove();
}

function editItem() {

}

function getEmail() {
    var email = document.getElementById("email");

}

function getName() {
    var name = document.getElementbyId("name");

}

function getTimeEstimate() {
    var timeEstimate = document.getElementById("timeEstimate");
}
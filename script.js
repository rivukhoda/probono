window.addEventListener('load', init);

function init() {
    document.getElementById("button").addEventListener('click', addItem);
}


function addItem() {
    var userInput = document.getElementById("input");
    var newContent = document.createTextNode(userInput.value);

    var checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");

    var label = document.createElement("label");
    label.appendChild(checkBox);
    label.appendChild(newContent);


    var newLi = document.createElement("li");
    newLi.appendChild(label);

    document.getElementById("list").appendChild(newLi);
    userInput.value = "";

}

function removeItem() {

}

function editItem() {

}
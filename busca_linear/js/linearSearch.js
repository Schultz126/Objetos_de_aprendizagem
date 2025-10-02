var searchedNumber;
var array = document.getElementsByClassName('value');
let fullValueBox = document.getElementsByClassName("number_box");
let isSearching = false;
let currentInfo = {current: fullValueBox[0], index: 0}
var list = [];

document.querySelector('button#submitButton').addEventListener('click', function() {
    searchedNumber = document.querySelector('input#searchedNumber').value;
    if(searchedNumber.trim() === "") {
        console.log("Digite um número");
    } else {
        searchedNumber = parseInt(searchedNumber, 10);
        console.log(searchedNumber);
        for(let i = 0; i < 8; i++) {
            list[i] = parseInt(array[i].textContent);
        }
        startSearch(0);
    }
    });

function startSearch(index) {
    isSearching = true;
    if(list[index] === searchedNumber) {
        currentInfo.current.classList.add("correct");
        document.querySelector("article#status").textContent = "Encontrado";
    }
    currentInfo.current.classList.add("current");   
}

document.querySelector('button#nextStep').addEventListener('click', function() {
    if(!isSearching) {
        window.alert("Busca ainda não iniciada");
    }
    else {
        alert("Busca iniciada");
    }
})

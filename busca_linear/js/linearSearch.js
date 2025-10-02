var searchedNumber;
var array = document.getElementsByClassName('value');
let fullValueBox = document.getElementsByClassName("number_box");
let isSearching = false;
// objeto DOM agrupado junto do índice atual
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
        search(0);
    }
    });

function search(index) {
    isSearching = true;
    if(list[index] === searchedNumber) {
        currentInfo.current.classList.add("correct");
        document.querySelector("article#status").textContent = "Encontrado";
        document.querySelector("article#status").classList.add("correct");
        // Todas as propriedades do início da busca são alteradas para o estado original
        isSearching = false;
    } else {
        currentInfo.current.classList.add("current"); 
        document.querySelector("article#status").textContent = "Não encontrado";
        document.querySelector("article#status").classList.add("current");
    }
    
      
}

// Evento do botão de próximo passo
document.querySelector('button#nextStep').addEventListener('click', function() {
    // Caso a busca ainda não tenha sido iniciada o programa não executará
    if(!isSearching) {
        window.alert("Busca ainda não iniciada");
    } else if(currentInfo.index === 7) {
        document.querySelector("article#status").textContent = "Não encontrado";
        document.querySelector("article#status").classList.add("passed");
        currentInfo.current.classList.add("passed");
        // índice do início da busca deve ser resetado
        currentInfo.index = 0;
    }
    else {
        currentInfo.current.classList.add("passed");
        currentInfo.index += 1;
        currentInfo.current= fullValueBox[currentInfo.index];
        search(currentInfo.index);  
    }
})

function reset() {
    for(let i = 0; i < 8; i++) {
        fullValueBox[i].classList.remove("correct", "passed", "current");
    }
    document.querySelector("article#status").textContent = "Busca não iniciada";
    document.querySelector("article#status").classList.remove("correct", "passed", "current");
    fullValueBox = document.getElementsByClassName("number_box");
    isSearching = false;
    // objeto DOM agrupado junto do índice atual
    currentInfo = {current: fullValueBox[0], index: 0}
}

// Botão de resetar. Remove todas as classes adicionadas aos elementos
document.querySelector('button#resetButton').addEventListener('click', reset)
document.querySelector('button#generateNumbersButton').addEventListener('click', reset);

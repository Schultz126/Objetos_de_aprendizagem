var searchedNumber; // Valor a ser buscado
var array = document.getElementsByClassName('value'); // Vetor para todas as caixas possuindo números
let fullValueBox = document.getElementsByClassName("number_box"); // Vetor para a caixa mais externa. Necessário para colorir o elemento
let isSearching = false; // Verifica se a busca está sendo realizada. Serve de controle para o botão button#nextStep
let binarySearchInfo = {left: 0, right: 8, mid: 0}
let list = []; // Vetor para armazenar os números a serem buscados

// Lê o número a ser procurado e verifica se realmente é um número que está sendo passado
document.querySelector('button#submitButton').addEventListener('click', function() {
    searchedNumber = document.querySelector('input#searchedNumber').value;
    if(searchedNumber.trim() === "") {
        console.log("Digite um número");
    } else {
        searchedNumber = parseInt(searchedNumber, 10);
        console.log(searchedNumber);
        for(let i = 0; i < 9; i++) {
            list[i] = parseInt(array[i].textContent);
        }
        binarySearch(0, 8);
    }
});

function binarySearch(left, right) {
    isSearching = true;
    if (left > right) {
        document.querySelector("article#status").textContent = "Elemento não encontrado";
        document.querySelector("article#status").classList.add('passed');
        return;
    }
    let mid = Math.floor(left + (right - left) / 2);
    //Variável necessária para a função do button#nextStep. Será a referência para colorir o número de vermelho
    binarySearchInfo.mid = mid;
    if (list[mid] === searchedNumber) {
        fullValueBox[mid].classList.add('correct');
        document.querySelector("article#status").textContent = "Elemento encontrado!";
        document.querySelector("article#status").classList.add('correct');
        return;
    } else if (list[mid] < searchedNumber) {
        fullValueBox[mid].classList.add('current');
        document.querySelector("article#status").textContent = "Elemento não encontrado";
        document.querySelector("article#status").classList.add('current');
        binarySearchInfo.left = mid + 1;
        //binarySearch(mid + 1, right);
    } else {
        fullValueBox[mid].classList.add('current');
        document.querySelector("article#status").textContent = "Elemento não encontrado";
        document.querySelector("article#status").classList.add('current');
        binarySearchInfo.right = mid - 1;
        //binarySearch(left, mid - 1);
    }
}

document.querySelector('button#nextStep').addEventListener('click', function() {
    if(!isSearching) {
        alert("Busca ainda não iniciada");
    } else if (binarySearchInfo.left > binarySearchInfo.right) {
        document.querySelector("article#status").textContent = "Elemento não encontrado";
        document.querySelector("article#status").classList.add('passed');
        return;
    } else {
        fullValueBox[binarySearchInfo.mid].classList.add('passed');
        binarySearch(binarySearchInfo.left, binarySearchInfo.right);
    }
})

// Função para restaurar os valores iniciais de cada elemento. Ela se faz necessária na medida em que 
// o vetor é completamente lido, ou no caso da chave ter sido encontrada
function reset() {
    for(let i = 0; i < 9; i++) {
        fullValueBox[i].classList.remove("correct", "passed", "current");
    }
    document.querySelector("article#status").textContent = "Busca não iniciada";
    document.querySelector("article#status").classList.remove("correct", "passed", "current");
    fullValueBox = document.getElementsByClassName("number_box");
    isSearching = false;
    // objeto DOM agrupado junto do índice atual
    binarySearchInfo.left = 0;
    binarySearchInfo.right = 8;
}

// Botão de resetar. Remove todas as classes adicionadas aos elementos
document.querySelector('button#resetButton').addEventListener('click', reset)
document.querySelector('button#generateNumbersButton').addEventListener('click', reset);
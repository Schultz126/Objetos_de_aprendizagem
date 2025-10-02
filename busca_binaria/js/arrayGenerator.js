document.querySelector('button#generateNumbersButton').addEventListener('click', generateArray);
window.addEventListener('load', generateArray);

function generateArray() {
    let auxiliaryArray = [];
    let button = document.getElementsByClassName('value');      
    for(let i = 0; i < 9; i++) {
        auxiliaryArray[i] = Math.floor(Math.random() * 99 + 1);
    }
    auxiliaryArray.sort(function(a, b) { return a - b; });
    for(let i = 0; i < 9; i++) {
        button[i].textContent = auxiliaryArray[i];
    }
}



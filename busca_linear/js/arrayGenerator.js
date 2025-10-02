document.querySelector('button#generateNumbersButton').addEventListener('click', generateArray);
window.addEventListener('load', generateArray);

function generateArray() {
    let button = document.getElementsByClassName('value');      
    for(let i = 0; i < 10; i++) {
        button[i].textContent = Math.floor(Math.random() * 99 + 1);
    }
}


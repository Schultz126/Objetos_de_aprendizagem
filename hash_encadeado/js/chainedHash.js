let insertedNumber;
var rows = document.getElementsByClassName('elementList');

function hash(value) {
    return value % 7;
}

// Função para ler o número a ser inserido
document.querySelector('button#insertButton').addEventListener('click', function() {
    insertedNumber = document.querySelector('input#insertedNumber').value; 
    if(insertedNumber.trim() === "") { // Verifica se um número foi digitado
        alert("Nenhum número inserido");
    } else {
        insertedNumber = parseInt(insertedNumber, 10); // Converte o valor do número de um String para um int
        console.log(insertedNumber);
        createElement(insertedNumber);
    }
});

function createElement(value) {
    let index = hash(value); // Índice em que o novo elemento será colocado
    let parent = rows[index]; // Linha da tabela em que o elemento será inserido
    let newElement = document.createElement('span'); // Criação do elemento
    newElement.classList.add('span:not(.root)'); 
    newElement.classList.add('newElement'); 
    newElement.textContent = value;

    if(parent) {
        parent.appendChild(newElement);
        visualHash(value, index);
    }
    else {
        alert("Não foi possível inserir o elemento");
    }
}

function visualHash(value, index) {
    var textBox = document.querySelector('article#visualExplanation');
    let message = `Resto da divisão de ${value} por 7 é ${index}, portanto, este será seu índice`; // Template da mensagem que será exibida

    textBox.textContent = message;
}

document.querySelector('button#resetButton').addEventListener('click', function() {
    let inputVal = document.querySelector('input#insertedNumber');
    let textBox = document.querySelector('article#visualExplanation');
    const elementLists = document.querySelectorAll('.elementList');
        elementLists.forEach(list => {
            // Encontra todos os elementos que não são a raiz
            const elementsToRemove = list.querySelectorAll('span:not(.root)');
            elementsToRemove.forEach(element => {
                // Remove o elemento do DOM
                element.remove();
                });
            }); 
    // Limpa o campo do input de números e remove a mensagem
    inputVal.value = '';
    textBox.value = '';
})

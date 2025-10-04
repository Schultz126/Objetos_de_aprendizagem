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
    newElement.classList.add('root'); 
    newElement.classList.add('newElement'); 
    newElement.textContent = value;

    if(parent) {
        parent.appendChild(newElement);
    }
    else {
        alert("Não foi possível inserir o elemento");
    }
}

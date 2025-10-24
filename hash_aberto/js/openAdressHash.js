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
    }
});
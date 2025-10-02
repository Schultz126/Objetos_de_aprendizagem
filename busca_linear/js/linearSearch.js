document.querySelector('button#submitButton').addEventListener('click', function() {
    let searchedNumber = document.querySelector('input#searchedNumber').value;
    if(searchedNumber.trim() === "") {
        console.log("Digite um número");
    } else {
        console.log(searchedNumber);
    }
});

let totalQuestions = 8;

function calResult() {
    let resultScore = 0; // initial count

    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    optionsSelected.forEach(input => {
        resultScore += Number(input.value);
    })

    // changing the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline';
    

    // display the score after user clicks submit
    document.getElementById('result-div').style.display = 'block';
    document.getElementById('result-heading').innerHTML = `YOUR SCORE: ${resultScore}`

    if(resultScore <= 16) {
        document.getElementById('result-div').classList.add('result-green-color', 'result-green-border');

        document.getElementById('result-heading').classList.add('result-green-color');

        document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.remove('result-orange-color', 'result-red-color');
        
    } else if(resultScore <= 32) {
        document.getElementById('result-div').classList.add('result-orange-color', 'result-orange-border');

        document.getElementById('result-heading').classList.add('result-orange-color');

        document.getElementById('result-div').classList.remove('result-green-color', 'result-green-border', 'result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.remove('result-green-color', 'result-red-color');

    } else {
        document.getElementById('result-div').classList.add('result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.add('result-red-color');

        document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-green-color', 'result-green-border');

        document.getElementById('result-heading').classList.remove('result-orange-color', 'result-green-color');

    }

}

function onChangeRadioButton(event) {

    let questionsAnswered = document.querySelectorAll('input[type="radio"]:checked').length;

    document.getElementById('progress').value = questionsAnswered / totalQuestions * 100;

    // enable submit button if all quesions are answered
    if (questionsAnswered == totalQuestions) {
        document.getElementById("result-button").disabled = false;
    }


    document.getElementById('result-button').style.display = 'inline';

}

function resetQuestionnaire() {

    let radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    radioButtons.forEach(value => {
        value.checked = false;
    });
    
    document.getElementById('progress').value = 10;

    // changing the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'inline';
    document.getElementById('reset-button').style.display = 'none';
    

    // display the score after user clicks submit
    document.getElementById('result-div').style.display = 'none';
    document.getElementById('result-heading').innerHTML = `RESULTS`

    document.getElementById('result-button').disabled = true;
}


document.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener('change', onChangeRadioButton);
});

// number of questions
let totalQuestions = 8;

// this function is called when Results button is clicked
function calResult() {
    let resultScore = 0; // initial result score

    // collecting all the radio buttons using JS selector and cal score
    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    optionsSelected.forEach(input => {
        resultScore += Number(input.value);
    })

    // Switching the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline';


    // Display the score after user clicks submit and unhiding the section
    document.getElementById('result-div').style.display = 'block';
    document.getElementById('result-heading').innerHTML = `YOUR SCORE: ${resultScore}`

    // contional score for cuusomised result section
    if (resultScore <= 16) {  // if score is less the 16 -> SUCCESS

        // display the SUCCESS animated sign and hiding others if displayed
        document.getElementsByClassName('success-sign')[0].style.display = 'block';
        document.getElementsByClassName('warning-sign')[0].style.display = 'none';
        document.getElementsByClassName('alert-sign')[0].style.display = 'none';

        // This section unhides the results section and add proper styles like GREEN for success
        document.getElementById('result-div').classList.add('result-green-color', 'result-green-border');

        document.getElementById('result-heading').classList.add('result-green-color');

        document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.remove('result-orange-color', 'result-red-color');

    } else if (resultScore <= 32) {  // if score is between the 16 and 32 -> WARNING

        // display the WARNING animated sign and hiding others if displayed
        document.getElementsByClassName('warning-sign')[0].style.display = 'block';
        document.getElementsByClassName('success-sign')[0].style.display = 'none';
        document.getElementsByClassName('alert-sign')[0].style.display = 'none';

        // This section unhides the results section and add proper styles like GREEN for success
        document.getElementById('result-div').classList.add('result-orange-color', 'result-orange-border');

        document.getElementById('result-heading').classList.add('result-orange-color');

        document.getElementById('result-div').classList.remove('result-green-color', 'result-green-border', 'result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.remove('result-green-color', 'result-red-color');

    } else {  // if score is greater the 32 -> ALERT

        // display the ALERT animated sign and hiding others if displayed
        document.getElementsByClassName('alert-sign')[0].style.display = 'block';
        document.getElementsByClassName('success-sign')[0].style.display = 'none';
        document.getElementsByClassName('warning-sign')[0].style.display = 'none';

        // This section unhides the results section and add proper styles like GREEN for success
        document.getElementById('result-div').classList.add('result-red-color', 'result-red-border');

        document.getElementById('result-heading').classList.add('result-red-color');

        document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-green-color', 'result-green-border');

        document.getElementById('result-heading').classList.remove('result-orange-color', 'result-green-color');

    }

}

// this button is called when any radio button is clicked/changed
function onChangeRadioButton(event) {

    let questionsAnswered = document.querySelectorAll('input[type="radio"]:checked').length;

    document.getElementById('progress').value = questionsAnswered / totalQuestions * 100;

    // enable submit button if all quesions are answered or radio buttons are checked
    if (questionsAnswered == totalQuestions) {
        document.getElementById("result-button").disabled = false;
    }


    document.getElementById('result-button').style.display = 'inline';

}

// this function is called for resetting the qesutionnaire
function resetQuestionnaire() {

    // selects all radio buttons and resets them
    let radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    radioButtons.forEach(value => {
        value.checked = false;
    });

    // default value of progress is 10 on a scale from 0 to 100
    document.getElementById('progress').value = 10;

    // changing the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'inline';
    document.getElementById('reset-button').style.display = 'none';


    // display the score after user clicks submit
    document.getElementById('result-div').style.display = 'none';
    document.getElementById('result-heading').innerHTML = `RESULTS`

    document.getElementById('result-button').disabled = true;
}

// adding event listener on any radio button change and calling the onChangeRadioButton function
document.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener('change', onChangeRadioButton);
});

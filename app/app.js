// number of questions
let totalQuestions = 80;
let paginationNumOfViews = 4
let questions = []
let results = {}

// read the questions csv data
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./assets/csv/questions.csv",
        dataType: "text",
        success: function(res) {
            processData(res);
            renderData();
            paginateTable()
            addEventListeners()
        }
     });
});

// process the questions csv data
const processData = (allText) => {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(';');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        if (data.length == headers.length) {

            var tarr = {};
            for (var j=0; j<headers.length; j++) {
                tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
        }
    }
    questions = lines;
    console.log(questions)
}

// render the questions onto the table using js
const renderData = () => {
    questions.forEach((question, idx) => {
        $('#tbody').append(`
            <tr>
                <td data-label="QUESTION #1">${question.question}</td>
                <td data-label="AGREE">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="1" class="option-green">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="DISAGREE">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="0" class="option-red">
                        <span class='checkmark'></span>
                    </label>
                </td>
            </tr>
        `)
    })
}

// Add pagination to the table
const paginateTable = () => {

    $('#data').after('<div id="nav"></div>');
    var rowsShown = totalQuestions / paginationNumOfViews;
    var rowsTotal = $('#data tbody tr').length;
    var numPages = rowsTotal/rowsShown;
    for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#/" rel="'+i+'">'+pageNum+'</a> ');
    }
    $('#data tbody tr').hide();
    $('#data tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function(){
        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#data tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
        css('display','table-row').animate({opacity:1}, 300);
    });
}

const addEventListeners = () => {
    // adding event listener on any radio button change and calling the onChangeRadioButton function
    document.querySelectorAll("input[type='radio']").forEach((input) => {
        input.addEventListener('change', onChangeRadioButton);
    });
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

    // calResult()
}

// this function is called when Results button is clicked
const calResult = () => {
    let resultScore = 0; // initial result score

    // collecting all the radio buttons using JS selector and cal score
    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    optionsSelected.forEach((input, idx) => {
        const questionCategory = questions[idx]['category']
        console.log(questions)
        const idxQuestionScore = Number(input.value)
        if(!results[questionCategory]) {
            results[questionCategory] = idxQuestionScore
        } else {
            results[questionCategory] += idxQuestionScore
        }
    })

    for(let key in results) {
        $('#show-results').append(`
            <div>${key}</div>
            <div>${results[key]}</div>
        `)
    }

    // // Switching the button 'Calculate Score' to 'Retake'
    // document.getElementById('result-button').style.display = 'none';
    // document.getElementById('reset-button').style.display = 'inline';


    // // Display the score after user clicks submit and unhiding the section
    // document.getElementById('result-div').style.display = 'block';
    // document.getElementById('result-score-heading').innerHTML = `Score: ${resultScore}`

    // console.log(results)

    // // contional score for cuusomised result section
    // if (resultScore <= 16) {  // if score is less the 16 -> SUCCESS

    //     // display the SUCCESS animated sign and hiding others if displayed
    //     document.getElementsByClassName('success-sign')[0].style.display = 'block';
    //     document.getElementsByClassName('warning-sign')[0].style.display = 'none';
    //     document.getElementsByClassName('alert-sign')[0].style.display = 'none';

    //     // This section unhides the results section and add proper styles like GREEN for success
    //     document.getElementById('result-div').classList.add('result-green-color', 'result-green-border');

    //     document.getElementById('result-heading').classList.add('result-green-color');
    //     document.getElementById('result-score-heading').classList.add('result-green-color');

    //     document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-red-color', 'result-red-border');

    //     document.getElementById('result-heading').classList.remove('result-orange-color', 'result-red-color');

    //     document.getElementById('result-score-heading').classList.remove('result-orange-color', 'result-red-color');

    //     document.getElementById('result-heading').innerHTML = 'Ready to go!';

    //     document.getElementsByClassName('success-result-content')[0].style.display = 'block'
    //     document.getElementsByClassName('warning-result-content')[0].style.display = 'none'
    //     document.getElementsByClassName('alert-result-content')[0].style.display = 'none'

    // } else if (resultScore <= 32) {  // if score is between the 16 and 32 -> WARNING

    //     // display the WARNING animated sign and hiding others if displayed
    //     document.getElementsByClassName('warning-sign')[0].style.display = 'block';
    //     document.getElementsByClassName('success-sign')[0].style.display = 'none';
    //     document.getElementsByClassName('alert-sign')[0].style.display = 'none';

    //     // This section unhides the results section and add proper styles like GREEN for success
    //     document.getElementById('result-div').classList.add('result-orange-color', 'result-orange-border');

    //     document.getElementById('result-heading').classList.add('result-orange-color');
    //     document.getElementById('result-score-heading').classList.add('result-orange-color');

    //     document.getElementById('result-div').classList.remove('result-green-color', 'result-green-border', 'result-red-color', 'result-red-border');

    //     document.getElementById('result-heading').classList.remove('result-green-color', 'result-red-color');
    //     document.getElementById('result-score-heading').classList.remove('result-green-color', 'result-red-color');

    //     document.getElementById('result-heading').innerHTML = 'Have some work to do!';

    //     document.getElementsByClassName('success-result-content')[0].style.display = 'none'
    //     document.getElementsByClassName('warning-result-content')[0].style.display = 'block'
    //     document.getElementsByClassName('alert-result-content')[0].style.display = 'none'

    // } else {  // if score is greater the 32 -> ALERT

    //     // display the ALERT animated sign and hiding others if displayed
    //     document.getElementsByClassName('alert-sign')[0].style.display = 'block';
    //     document.getElementsByClassName('success-sign')[0].style.display = 'none';
    //     document.getElementsByClassName('warning-sign')[0].style.display = 'none';

    //     // This section unhides the results section and add proper styles like GREEN for success
    //     document.getElementById('result-div').classList.add('result-red-color', 'result-red-border');

    //     document.getElementById('result-heading').classList.add('result-red-color');
    //     document.getElementById('result-score-heading').classList.add('result-red-color');

    //     document.getElementById('result-div').classList.remove('result-orange-color', 'result-orange-border', 'result-green-color', 'result-green-border');

    //     document.getElementById('result-heading').classList.remove('result-orange-color', 'result-green-color');
    //     document.getElementById('result-score-heading').classList.remove('result-orange-color', 'result-green-color');

    //     document.getElementById('result-heading').innerHTML = 'Cannot go-live!';

    //     document.getElementsByClassName('success-result-content')[0].style.display = 'none'
    //     document.getElementsByClassName('warning-result-content')[0].style.display = 'none'
    //     document.getElementsByClassName('alert-result-content')[0].style.display = 'block'
    // }

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
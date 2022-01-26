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
}

// render the questions onto the table using js
const renderData = () => {
    questions.forEach((question, idx) => {
        $('#tbody').append(`
            <tr>
                <td class="question-number-label">${idx + 1}</td>
                <td data-label="QUESTION #1" colspan="3">${question.question}</td>
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

    $('#questionnaire-table').after('<div id="nav">Page: </div>');
    var rowsShown = totalQuestions / paginationNumOfViews;
    var rowsTotal = $('#questionnaire-table tbody tr').length;
    var numPages = rowsTotal/rowsShown;
    for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#/" rel="'+i+'">'+pageNum+'</a> ');
    }
    $('#questionnaire-table tbody tr').hide();
    $('#questionnaire-table tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function(){
        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#questionnaire-table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
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
}

const getScoreCategory = (key, score) => {
    if(key === 'activist') {
        if(score > 12) return 'Very High'
        if(score > 10) return 'Strong'
        if(score > 6) return 'Moderate'
        if(score > 3) return 'Low'
        return 'Very Low'
    }
    if(key === 'reflector') {
        if(score > 17) return 'Very High'
        if(score > 14) return 'Strong'
        if(score > 11) return 'Moderate'
        if(score > 8) return 'Low'
        return 'Very Low'
    }
    if(key === 'theorist') {
        if(score > 15) return 'Very High'
        if(score > 13) return 'Strong'
        if(score > 10) return 'Moderate'
        if(score > 7) return 'Low'
        return 'Very Low'
    }
    if(key === 'pragmatist') {
        if(score > 16) return 'Very High'
        if(score > 14) return 'Strong'
        if(score > 11) return 'Moderate'
        if(score > 7) return 'Low'
        return 'Very Low'
    }
}

// this function is called when Results button is clicked
const calResult = () => {
    let resultScore = 0; // initial result score

    // collecting all the radio buttons using JS selector and cal score
    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    optionsSelected.forEach((input, idx) => {
        const questionCategory = questions[idx]['category']
        // console.log(questions)
        const idxQuestionScore = Number(input.value)
        if(!results[questionCategory]) {
            results[questionCategory] = idxQuestionScore
        } else {
            results[questionCategory] += idxQuestionScore
        }
    })
    
    // Switching the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline';
    
    
    // Display the score after user clicks submit and unhiding the section
    $('#result-div').removeClass('hidden')
    $('#show-results tbody').innerHTML = ``

    for(let key in results) {
        let score = results[key];
        let category = getScoreCategory(key, score)
        $('#show-results tbody').append(`
                <tr>
                    <td class="question_category_td">${key}</td>
                    <td class="score_td">
                        <div class="form-group slider">
                            <span class="slider_label">Very Low &nbsp;&nbsp;&nbsp;</span>
                            <input id="range_slider_${key}" type="range" value="${results[key]}" step="1" min="0" max="20" disabled>
                            <span class="slider_label">&nbsp;&nbsp;&nbsp; Very High </span>
                        </div>
                        <div class="category">
                            <span class="score_category_${key} score_category">${category}</span>
                            <span>Score: ${score}</span>
                        </div>
                    </div>
                </tr>
        `)
        document.getElementById(`range_slider_${key}`).style = 'background: linear-gradient(to right, red, yellow, green)'
    }
}

// this function is called for resetting the qesutionnaire
function resetQuestionnaire() {

    // selects all radio buttons and resets them
    let radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    radioButtons.forEach(value => {
        value.checked = false;
    });

    // default value of progress is 10 on a scale from 0 to 100
    document.getElementById('progress').value = 2;

    // changing the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'inline';
    document.getElementById('reset-button').style.display = 'none';


    // display the score after user clicks submit
    document.getElementById('result-div').style.display = 'none';
    document.getElementById('result-heading').innerHTML = `RESULTS`

    document.getElementById('result-button').disabled = true;
}
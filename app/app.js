// number of questions
let totalQuestions = 80
let totalTablePages = 10
let currPageNum = 1
let questions = []
let results = {}
const CATEGORY_ACTIVIST = 'activist'
const CATEGORY_THEORIST = 'theorist'
const CATEGORY_REFLECTOR = 'reflector'
const CATEGORY_PRAGMATIST = 'pragmatist'

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
                <td class="questions" data-label="QUESTION #${idx + 1}" colspan="3">${question.question}</td>
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

const paginateNextQuestions = () => {
    const currPage = $('#nav a.active')[0]?.innerHTML
    var rowsShown = totalQuestions / totalTablePages;
    var startItem = currPage * rowsShown;
    var endItem = startItem + rowsShown;
    $('#questionnaire-table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
    css('display','table-row').animate({opacity:1}, 300);
    const nextPage = currPage
    if(nextPage <= totalTablePages) {
        $('#nav a.active').removeClass('active')
        $($('#nav a')[nextPage]).addClass('active');
    }
    if((Number(nextPage) + 1) === totalTablePages) {
        $('#nextPage').attr("disabled", true);
        $('#nextPage').addClass('hidden')
        $('#result-button').removeClass('hidden')
    } else {
        $('#nextPage').removeAttr("disabled");
        $('#nextPage').removeClass('hidden')
        $('#result-button').addClass('hidden')
    }
    $('#prevPage').removeAttr("disabled");
}

const paginatePrevQuestions = () => {
    const currPage = $('#nav a.active')[0]?.innerHTML
    const prevPage = currPage - 2
    var rowsShown = totalQuestions / totalTablePages;
    var startItem = prevPage * rowsShown;
    var endItem = startItem + rowsShown;
    $('#questionnaire-table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
    css('display','table-row').animate({opacity:1}, 300);
    if(prevPage >= 0) {
        $('#nav a.active').removeClass('active')
        $($('#nav a')[prevPage]).addClass('active');
    }
    if((Number(prevPage)) === 0) {
        $('#prevPage').attr("disabled", true);
    } else {
        $('#prevPage').removeAttr("disabled");
    }
    $('#nextPage').removeAttr("disabled");
    $('#nextPage').removeClass("hidden");
    $('#result-button').addClass('hidden')
}

// Add pagination to the table
const paginateTable = () => {

    $('#score-div').append('<div id="nav">Page: </div>');
    var rowsShown = totalQuestions / totalTablePages;
    var rowsTotal = $('#questionnaire-table tbody tr').length;
    var numPages = rowsTotal/rowsShown;
    // $('#nav').append('<button id="prevPage" type="button" onclick="paginatePrevQuestions()" disabled>Previous</button>')
    for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#/" rel="'+i+'">'+pageNum+'</a> ');
    }
    // $('#nav').append('<button id="nextPage" type="button" onclick="paginateNextQuestions()">Next</button>')
    $('#questionnaire-table tbody tr').hide();
    $('#questionnaire-table tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function() {
        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#questionnaire-table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
        css('display','table-row').animate({opacity:1}, 300);
        
        currPageNum = Number($(this)[0].innerHTML)
        if((currPageNum - 1)  === 0) {
            $('#prevPage').attr("disabled", true);
        } else {
            $('#prevPage').removeAttr("disabled");
        }
        if(currPageNum === totalTablePages) {
            $('#nextPage').attr("disabled", true);
            $('#nextPage').addClass('hidden')
            $('#result-button').removeClass('hidden')
        } else {
            $('#nextPage').removeAttr("disabled");
            $('#nextPage').removeClass("hidden");
            $('#result-button').addClass('hidden')
        }
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
    if(key === CATEGORY_ACTIVIST) {
        if(score > 12) return 'Very High'
        if(score > 10) return 'Strong'
        if(score > 6) return 'Moderate'
        if(score > 3) return 'Low'
        return 'Very Low'
    }
    if(key === CATEGORY_REFLECTOR) {
        if(score > 17) return 'Very High'
        if(score > 14) return 'Strong'
        if(score > 11) return 'Moderate'
        if(score > 8) return 'Low'
        return 'Very Low'
    }
    if(key === CATEGORY_THEORIST) {
        if(score > 15) return 'Very High'
        if(score > 13) return 'Strong'
        if(score > 10) return 'Moderate'
        if(score > 7) return 'Low'
        return 'Very Low'
    }
    if(key === CATEGORY_PRAGMATIST) {
        if(score > 16) return 'Very High'
        if(score > 14) return 'Strong'
        if(score > 11) return 'Moderate'
        if(score > 7) return 'Low'
        return 'Very Low'
    }
}

const getCategoryCharacter = category => {
    if(category === CATEGORY_ACTIVIST)
        return `<img height="120" src="./assets/svg/active.svg" />`
    if(category === CATEGORY_PRAGMATIST)
        return `<img height="100" src="./assets/svg/prag.svg" />`
    if(category === CATEGORY_REFLECTOR)
        return `<img height="130" src="./assets/svg/reflect.svg" />`
    if(category === CATEGORY_THEORIST)
        return `<img height="120" src="./assets/svg/theory.svg" />`
}

const setRangeSliderBackground = category => {
    if(category === CATEGORY_ACTIVIST)
        return document.getElementById(`range_slider_${category}`).style = 
            `background: linear-gradient(to right, white, #20315F)`

    if(category === CATEGORY_PRAGMATIST)
    return document.getElementById(`range_slider_${category}`).style = 
        `background: linear-gradient(to right, white, #D11138)`

    if(category === CATEGORY_REFLECTOR)
    return document.getElementById(`range_slider_${category}`).style = 
        `background: linear-gradient(to right, white, #939598)`

    if(category === CATEGORY_THEORIST)
    return document.getElementById(`range_slider_${category}`).style = 
        `background: linear-gradient(to right, white, #000)`
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
    $('#questionnaire-container').css('padding' , '0px')
    
    
    // Display the score after user clicks submit and unhiding the section
    $('#form-container').addClass('hidden')
    $('#result-div').removeClass('hidden')
    $('#show-results tbody').innerHTML = ``

    for(let key in results) {
        let score = results[key];
        let category = getScoreCategory(key, score)
        $('#show-results tbody').append(`
                <tr>
                    <td colspan="2" class="question_category_td">${key}</td>
                </tr>
                <tr>
                    <td class="question_category_character">
                        ${getCategoryCharacter(key)}
                    </td>
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
        setRangeSliderBackground(key)
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
// number of questions
let totalQuestions = 18
let totalTablePages = 2
let currPageNum = 1
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
        let options = ['D', 'C', 'B', 'A']
        if(question.isLetter != "yes") {
            options = ['1', '2', '3', '4']
        }
        $('#tbody').append(`
            <tr>
                <td class="question-number-label">${idx + 1}</td>
                <td class="questions" data-label="QUESTION #${idx + 1}" colspan="2">${question.left}</td>
                <td data-label="Strongly Agree">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="${options[0]}" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="Somewhat Agree">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="${options[1]}" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="Somewhat Disagree">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="${options[2]}" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="Strongly Disagree">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="${options[3]}" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td class="questions" data-label="QUESTION #${idx + 1}" colspan="3">${question.right}</td>
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
        document.getElementById('result-button').style.display = 'inline';
    }
}

// this function is called when Results button is clicked
const calResult = () => {
    let resultScore = 0; // initial result score

    // collecting all the radio buttons using JS selector and cal score
    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    let score = {}
    optionsSelected.forEach((input, idx) => {
        const val = input.value;
        if(score[val] == undefined) {
            score[val] = 1
        } else {
            score[val] += 1
        }
    })

    let maxScoreNum = Math.max(
        Math.max(
            score['1'] ? score['1'] : 0, 
            score['2'] ? score['2'] : 0), 
        Math.max(
            score['3'] ? score['3'] : 0, 
            score['4'] ? score['4'] : 0, ))

    let maxScoreLetter = Math.max(
        Math.max(
            score['A'] ? score['A'] : 0, 
            score['B'] ? score['B'] : 0 ),
        Math.max(
            score['C'] ? score['C'] : 0, 
            score['D'] ? score['D'] : 0, ))

    console.log(maxScoreLetter, maxScoreNum, score)

    let category = []
    if(maxScoreLetter === score['D'] && maxScoreNum === score['2']) if(!category.includes('analyzer')) category.push('analyser')
    if(maxScoreLetter === score['D'] && maxScoreNum === score['1']) if(!category.includes('analyzer')) category.push('analyser')
    if(maxScoreLetter === score['C'] && maxScoreNum === score['1']) if(!category.includes('analyzer')) category.push('analyser')
    if(maxScoreLetter === score['C'] && maxScoreNum === score['2']) if(!category.includes('analyzer')) category.push('analyser')
    if(maxScoreLetter === score['B'] && maxScoreNum === score['1']) if(!category.includes('driver')) category.push('driver')
    if(maxScoreLetter === score['B'] && maxScoreNum === score['2']) if(!category.includes('driver')) category.push('driver')
    if(maxScoreLetter === score['A'] && maxScoreNum === score['1']) if(!category.includes('driver')) category.push('driver')
    if(maxScoreLetter === score['A'] && maxScoreNum === score['2']) if(!category.includes('driver')) category.push('driver')
    if(maxScoreLetter === score['D'] && maxScoreNum === score['3']) if(!category.includes('amiable')) category.push('amiable')
    if(maxScoreLetter === score['D'] && maxScoreNum === score['4']) if(!category.includes('amiable')) category.push('amiable')
    if(maxScoreLetter === score['C'] && maxScoreNum === score['3']) if(!category.includes('amiable')) category.push('amiable')
    if(maxScoreLetter === score['C'] && maxScoreNum === score['4']) if(!category.includes('amiable')) category.push('amiable')
    if(maxScoreLetter === score['B'] && maxScoreNum === score['3']) if(!category.includes('expressive')) category.push('expressive')
    if(maxScoreLetter === score['B'] && maxScoreNum === score['4']) if(!category.includes('expressive')) category.push('expressive')
    if(maxScoreLetter === score['A'] && maxScoreNum === score['3']) if(!category.includes('expressive')) category.push('expressive')
    if(maxScoreLetter === score['A'] && maxScoreNum === score['4']) if(!category.includes('expressive')) category.push('expressive')

    category.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })

    $('#result-image').append(`<img src="./assets/svg/${category.toString()}.svg" />`)
    $('#result-title').append(`You are <br/> <b>${category.toString()?.replaceAll(',', ' and ').toLocaleUpperCase()}</b>`)
    category.map((c, i) => {
        $('#expressives').append(`<div class="show-results-heading">${category[i].toUpperCase()}</div>`);
        $('#expressives').append(`<div class="show-results-content">${content[category[i]]}</div>`);
    });


    // Switching the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline';
    $('#questionnaire-container').css('padding' , '0px')
    
    // Display the score after user clicks submit and unhiding the section
    $('#form-container').addClass('hidden')
    $('#result-div').removeClass('hidden')

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
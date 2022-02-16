// number of questions
let totalQuestions = 50
let totalTablePages = 8
let currPageNum = 1
let questions = []
let results = {}
const CATEGORY_DECISION = 'decision making'
const CATEGORY_MANAGING = 'managing'
const CATEGORY_PERCEIVING = 'perceiving'
const CATEGORY_INFLUENCING = 'influencing'
const CATEGORY_ACHIEVING = 'achieving'

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
                <td data-label="VERY SELDOM OR NOT TRUE OF ME">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="1" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="SELDOM TRUE OF ME">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="2" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="SOMETIMES TRUE OF ME">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="3" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="OFTEN TRUE OF ME">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="4" class="option-orange">
                        <span class='checkmark'></span>
                    </label>
                </td>
                <td data-label="VERY OFTEN TRUE OF ME OR TRUE OF ME">
                    <label class='container'>
                        <input type="radio" name="ques${idx}" value="5" class="option-orange">
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
        document.getElementById('result-button').style.display = 'inline';
    }
}

const getCategoryCharacter = category => {
    if(category === CATEGORY_MANAGING)
        return `<img height="120" src="./assets/svg/managing.svg" />`
    if(category === CATEGORY_PERCEIVING)
        return `<img height="100" src="./assets/svg/perceiving.svg" />`
    if(category === CATEGORY_INFLUENCING)
        return `<img height="130" src="./assets/svg/influencing.svg" />`
    if(category === CATEGORY_ACHIEVING)
        return `<img height="120" src="./assets/svg/achieving.svg" />`
    if(category === CATEGORY_DECISION)
        return `<img height="120" src="./assets/svg/decisionmaking.svg" />`
}

const calStandardisedScore = results => {
    const standardResults = []
    for(category in results) {
        if(category === CATEGORY_PERCEIVING)
        standardResults[category] = (results[category] - 43.14) / 7.28 + 5.00
        
        else if(category === CATEGORY_MANAGING)
        standardResults[category] = (results[category] - 33.9) / 6.13 + 5.00
        
        else if(category === CATEGORY_DECISION)
        standardResults[category] = (results[category] - 34.14) / 3.83 + 5.00
        
        else if(category === CATEGORY_ACHIEVING)
        standardResults[category] = (results[category] - 28.46) / 5.68 + 5.00
        
        else if(category === CATEGORY_INFLUENCING)
        standardResults[category] = (results[category] - 32.01) / 7.4 + 5.00   
    }
    return standardResults
}

function capitalize(str) {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
}

// this function is called when Results button is clicked
const calResult = () => {
    let resultScore = 0; // initial result score

    // collecting all the radio buttons using JS selector and cal score
    let optionsSelected = document.querySelectorAll('input[type="radio"]:checked')
    optionsSelected.forEach((input, idx) => {
        const questionCategory = questions[idx]['category']
        const isResponseReversed = questions[idx]['reversed']
        // console.log(questions)
        const idxQuestionScore = Number(input.value)
        if(isResponseReversed === 'yes') {
            idxQuestionScore = 6 - idxQuestionScore
        }
        if(!results[questionCategory]) {
            results[questionCategory] = idxQuestionScore
        } else {
            results[questionCategory] += idxQuestionScore
        }
    })

    let standardResults = calStandardisedScore(results)

    const categories = [capitalize(CATEGORY_MANAGING), 
        capitalize(CATEGORY_PERCEIVING), 
        capitalize(CATEGORY_INFLUENCING), 
        capitalize(CATEGORY_ACHIEVING), 
        capitalize(CATEGORY_DECISION)]
    const totalScore = [results[CATEGORY_MANAGING], 
                        results[CATEGORY_PERCEIVING],
                        results[CATEGORY_INFLUENCING],
                        results[CATEGORY_ACHIEVING],
                        results[CATEGORY_DECISION]
                    ]
    const standardScore = [standardResults[CATEGORY_MANAGING], 
                            standardResults[CATEGORY_PERCEIVING],
                            standardResults[CATEGORY_INFLUENCING],
                            standardResults[CATEGORY_ACHIEVING],
                            standardResults[CATEGORY_DECISION]
                        ]
    plotResultGraph(totalScore, standardScore, categories)
    $('.highcharts-credits').addClass('hidden')
    
    // Switching the button 'Calculate Score' to 'Retake'
    document.getElementById('result-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline';
    document.getElementById('download').style.display = 'inline';
    document.getElementById('instruction').style.display = 'none';
    $('#questionnaire-container').css('padding' , '0px')
    
    
    // Display the score after user clicks submit and unhiding the section
    $('#form-container').addClass('hidden')
    $('#result-div').removeClass('hidden')

     let strengthCat, strengthCatScore = 0
     for(let cat in results) {
         if(results[cat] > strengthCatScore) {
            strengthCatScore = results[cat]
            strengthCat = cat
         }
     }
    $('#strength-area').text(strengthCat)
    $('#strength-svg').append(getCategoryCharacter(strengthCat))
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
    document.getElementById('download').style.display = 'none';


    // display the score after user clicks submit
    document.getElementById('result-div').style.display = 'none';
    document.getElementById('result-heading').innerHTML = `RESULTS`
    document.getElementById('download').style.display = 'none';

    document.getElementById('result-button').disabled = true;
}

const downloadPDF = () => {
    var divContents = $("#result-div").html();
    var printWindow = window.open('', '', 'height=400,width=900');
    printWindow.document.write('<html><head><title>Emotional Intelligence Skills</title>');
    printWindow.document.write('<link rel="stylesheet" href="./app/printPDF.css" />');
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}
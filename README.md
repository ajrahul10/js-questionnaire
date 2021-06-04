# js-questionnaire

This is a dynamic form which is built with pure Javascript. 

It contains:
- Styled layout
- Responsive on any device
- Color coded options
- Hover and onclick functionalities
- Progress bar
- Font-awesome library for refresh icon
- Animated results page

To add/remove a Question: 
1. Check the respective "tr" tags for respective Question in the index.html
2. Add/Remove the entire "tr" tag for the question
3. If you are adding a question, update the Question heading and for the radio boxes update the name attribute. 
    Eg: "<input type="radio" name="ques9" value="1" class="option-green">"

    Here "ques 9" is the attribute for Question 9. Repeat the process for all name attributes for that question.
4. Update the "totalQuestions" varible to total number of questions in app.js (currently set at 8).
5. Update the scoring system in the "calResult" function in app.js. The if statements contains the score checks which needs to be updated.


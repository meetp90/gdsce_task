var ques;

$( document ).ready(function() {
    $(".questionContainer").hide();
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=10',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            ques = data;
        }
      });
      $(".popupButton").click(function(){
        $(".popup").fadeOut();
        $("lottie-player").fadeOut();
        $(".questionContainer").fadeIn();
        addQuestions(ques);
    });
});

function addQuestions(data) {
    var questionsAll = [];
    $.each(data.results,function(i,questions){
        options = assignData(questions);
        if (options.length == 2){
            options.push("Maybe");
            options.push("Don't know");
        }
        var q =  ' <div class="col"><div class="card h-90"><div class="card-body"><h5 class="card-header">'
        +questions.question+
        '</h5><p class="card-text"><br> <input class="form-check-input mx-1 my-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1"><label class="form-check-label" for="flexRadioDefault1">'+
        options[0]
        +'</label><br><input class="form-check-input mx-1 my-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1"><label class="form-check-label" for="flexRadioDefault1">'
        +options[1]+
        '</label><br><input class="form-check-input mx-1 my-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1"><label class="form-check-label" for="flexRadioDefault1">'+
        options[2]+'</label><br><input class="form-check-input mx-1 my-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1"><label class="form-check-label" for="flexRadioDefault1">'+options[3]+'</label></p></div></div></div> '
        questionsAll.push(q)
    })
    $(".questionContainer").append(questionsAll.join(""));
    $(".questionContainer").show();
}


function assignData(data) {
    var question = data.question;
    var correctAnswer = data.correct_answer;
    var incorrectAnswers = data.incorrect_answers;
    var allAnswers = incorrectAnswers.concat(correctAnswer);
    var shuffledAnswers = shuffle(allAnswers);
    console.log(shuffledAnswers);
    return shuffledAnswers;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


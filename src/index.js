
class Question {
    constructor(text, choices, answer) {
        this.text = text;
        this.choices = choices;
        this.answer = answer;
    }

    isCorrectAnswer(choice) {
        return this.answer === choice;
    }
}

class Quiz {
    constructor(questions) {
        this.score = 0;
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.color = "";
    }
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }
    guess(answer) {
        if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
            this.score++;
            this.color = "green";
        } else {
            this.color = "red";
        }
        this.currentQuestionIndex++;
    }
    hasEnded() {
        return this.currentQuestionIndex === this.questions.length;
    }
}

 class ProgressBar {
    constructor(element, initialValue = 0) {
        this.fillElement = element.querySelector("#progressBarFill");
        this.setValue(initialValue);
    }

    setValue(newValue) {
        if (newValue < 0) {
            newValue = 0;
        }
        if (newValue > 100) {
            newValue = 100;
        }
        this.value = newValue;
        this.update();
    }

    update() {
        const percentage = this.value + '%';
        this.fillElement.style.width = percentage;
    }
 }

function populate() {
    if (quiz.hasEnded()) {
        showScore();
    } else {
        document.getElementById("question").innerHTML = quiz.getCurrentQuestion().text;
        const choices = quiz.getCurrentQuestion().choices;
        for (let index = 0; index < choices.length; index++) {
            document.getElementById("choice" + index).innerHTML = choices[index];
            guessHandler("btn" + index, choices[index]);
        }
        showProgress();
        const progressBar = new ProgressBar(document.querySelector("#progressBar"));
        progressBar.setValue(((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100);
    }
};

function guessHandler(id, guess) {
    const button = document.getElementById(id);
    button.onclick = function() {
        quiz.guess(guess);
        button.style.backgroundColor = quiz.color;
        setTimeout(function() {
            button.style.backgroundColor = null;
            populate();
        }, 500);
    }
};


function showProgress() {
    const currentQuestionNum = quiz.currentQuestionIndex + 1;
    document.getElementById("progress").innerHTML = "Question " + currentQuestionNum + " of " + quiz.questions.length;
};


function showScore() {
    let quizOverHTML = "<h1 class='main-header'>Results</h1>";
    quizOverHTML += "<h2 id='score'> Your score: " + quiz.score + "/" + quiz.questions.length + "</h2>";
    quizOverHTML += "<div class='try-again'><a class='try-again-btn' href='index.html'>Try Again</a></div>"
    document.getElementById("quiz").innerHTML = quizOverHTML;
};

function shuffle(array) {
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        const tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }
    if(array.length ==  2) {
        array.push("maybe");
        array.push("probably");
    }
    return array;
    
};


async function fetchData() {
    let response = await fetch("https://opentdb.com/api.php?amount=10");
    if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
    } else {
        return await response.json();
    }
}

let quiz;
fetchData().then((data) => {
    const results = data.results;
    const questions = [];
    results.forEach(function(result) {
        const answers = result.incorrect_answers.concat(result.correct_answer);
        shuffle(answers);
        const question = new Question(result.question, answers, result.correct_answer);
        questions.push(question);
    });

    quiz = new Quiz(questions);
    populate();
}).catch(err => console.log(err));

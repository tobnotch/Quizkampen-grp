const questions = [
    {
        question: "Vilket land är känt för att ha uppfunnit sporten fotboll?",
        answers: [
            {text: "Brasilien", correct: false},
            {text: "England", correct: true},
            {text: "Italien", correct: false},
            {text: "Spanien", correct: false},
        ]
    },
    {
        question: "Vad är den högsta poängen en enskild spelare kan uppnå i en omgång av bowling?",
        answers: [
            {text: "100", correct: false},
            {text: "200", correct: false},
            {text: "300", correct: true},
            {text: "400", correct: false},
        ]
    },
    {
        question: "Vilket av följande djur är inte en symbol för de olympiska spelen?",
        answers: [
            {text: "Lejon", correct: false},
            {text: "Tiger", correct: false},
            {text: "Örn", correct: true},
            {text: "Björn", correct: false},
        ]
    },
    {
        question: 'Vem betraktas som "The Greatest" inom boxning och har vunnit världsmästartitlar i flera viktklasser?',
        answers: [
            {text: "Muhammad Ali", correct: true},
            {text: "Mike Tyson", correct: false},
            {text: "George Foreman", correct: false},
            {text: "Manny Pacquiao", correct: false},
        ]
    },
    {
        question: 'Vilken tennisspelare kallas också "King of Clay" och är mest framstående på grusunderlag?',
        answers: [
            {text: "Roger Federer", correct: false},
            {text: "Rafael Nadal", correct: true},
            {text: "Novak Djokovic", correct: false},
            {text: "Andy Murray", correct: false},
        ]
    }
];

const backgroundsArray = [
    {
        backgrounds: [
            {text: "#92c5ff"},
            {text: "#219ebc"},
            {text: "#023047"},
            {text: "#fb8500"},
            {text: "#ffb703"},
        ]
    }
];

const questionHeader = document.querySelector('h2');
const questionElement = document.querySelector('.question');
const answerButtons = document.querySelector('.button-container');
const nextButton = document.querySelector('#next-btn');
const bodyElement = document.querySelector('body');

let currentQuestionIndex = 0;
let score = 0;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    questionElement.style = "font-size: 1em";
    // nextButton.innerHTML = "Nästa";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let currentBackground = backgroundsArray[0].backgrounds[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionHeader.innerHTML = "Fråga " + questionNo + "/" + "5";
    questionElement.innerHTML = currentQuestion.question;
    bodyElement.style.backgroundColor = currentBackground.text;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("option");
        answerButtons.appendChild(button);

        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

setTimeout(() => {
    if (answer.correct) {
      score++;
    }
    selectedBtn.classList.remove("correct", "incorrect"); 
    currentQuestionIndex++;
  }, 1000); 

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if(isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        setTimeout(() => {
        NextQuestion();
        }, 1000);
    }
    else {
        selectedBtn.classList.add("incorrect");
        setTimeout(() => {
        NextQuestion();
        }, 1000);
    }

    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    })
    // nextButton.style.display = "flex";
}

nextButton.addEventListener("click", () => {
    // if(currentQuestionIndex < questions.length) {
    //     NextQuestion();
    // }
    // else {
        startGame();
        // här kan man lägga till funktionalitet
        // för att återgå till startsidan
    // }
});

function NextQuestion() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    }
    else {
        showScore();
    }
}

function showScore() {
    resetState();

    questionHeader.innerHTML = "";

    questionElement.innerHTML = `Du fick ${score} av ${questions.length} poäng!`;
    questionElement.style = "font-size: 1.75em; margin-bottom: 30px";
    bodyElement.style = "background-color: #ffef9f";

    nextButton.innerHTML = "Spela igen";
    nextButton.style.display = "flex";
}

startGame();
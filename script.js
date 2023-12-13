import Question from "./Modules/question.js";


const history = [];
history.push(new Question("Vem var kung över Sverige 1705?", "Karl XII", ["Karl XII", "Karl XI", "Gustav Vasa", "Oscar II"], "text"))

ClearMainContainer();
let questionNumber = 0;
const currentQuestion = history[questionNumber];
let totalQuestions = history.length;

AddQuestionElements(currentQuestion, questionNumber, totalQuestions);


function ClearMainContainer() {
    const mainContainer = document.querySelector("#main-container");
    mainContainer.innerHTML = "";
    // while(mainContainer.firstChild) {
    //     mainContainer.remove(mainContainer.lastChild);
    // }
}

function AddQuestionElements(questionDetails, questionNumber, totalQuestions){
    const mainContainer = document.querySelector("#main-container");
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");

    const questionCounter = document.createElement("h2");
    questionCounter.classList.add("question-counter");
    questionCounter.innerHTML = `Fråga ${questionNumber + 1}/${totalQuestions}.`;
    questionContainer.appendChild(questionCounter);

    const questionText = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.innerHTML = questionDetails.questionText;
    questionContainer.appendChild(questionText);
    mainContainer.appendChild(questionContainer);

    if (questionDetails.type === "image") {

    }
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    mainContainer.appendChild(buttonContainer);
    questionDetails.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.classList.add("buttons");
        btn.innerHTML = answer;
        if (answer === questionDetails.correct) {
            btn.dataset.correct = "true";
        }
        buttonContainer.appendChild(btn);
    })
    AddButtonEvents();
}
function AddButtonEvents() {
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => {
                if (btn.classList.contains("correct")) {
                    btn.classList.remove("correct");
                }
                if (btn.classList.contains("wrong")) {
                    btn.classList.remove("wrong");
                }
                
            })
            if (button.dataset.correct != null) {
                button.classList.add("correct");
            }
            else {
                button.classList.add("wrong");
            }
        })
    })
}
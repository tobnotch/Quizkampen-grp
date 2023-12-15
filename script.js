import Question from "./Modules/question.js";
import GenerateStartScreen from "./Modules/startScreen.js";
import CreateQuestionElements from "./Modules/questionScreen.js";
import RandomizeOrder from "./Modules/randomizeArray.js";

const state = {
    currentQuestion: 0,
    maxQuestions: 0,
    currentCategory: [],
    categoryName: "",
    correctAnswers: 0,
    duration: "5s",
    answers: [],
    Reset() {
        this.currentQuestion = 0;
        this.maxQuestions = 0;
        this.currentCategory = [];
        this.categoryName = "";
        this.correctAnswers = 0;
        this.duration = "5s";
        this.answers = [];
        
    }
}

const history = [];
const imgTest = new Question("Jättelång frågetext för att se vad som händer om man har jättemycket text i frågan. Kan vi hantera det eller vad är max?",
                             "Lützen", ["Lützen", "Narva", "Breitenfeld", "Lund"], "image", "Slaget vid Lützen", "https://shorturl.at/vKWZ1");
history.push(imgTest);
history.push(new Question("Jättelång frågetext för att se vad som händer om man har jättemycket text i frågan. Kan vi hantera det eller vad är max?", "Karl XII", ["Karl XII", "Karl XI", "Gustav Vasa", "Oscar II"], "text"))

const geography = [];
geography.push(new Question("Fråga om geografi. Vad är svaret?", "Ja", ["Ja", "Nej", "Kanske", "Va?"]));
geography.push(new Question("Fråga om geografi. Vad är svaret?", "Ja", ["Ja", "Nej", "Kanske", "Va?"]));


const science = [];
science.push(new Question("Fråga om vetenskap. Vad är en bäver?", "Bäver", ["Bäver", "Växt", "Kruka", "Vatten"]));
science.push(new Question("Fråga om vetenskap. Vad är en bäver?", "Bäver", ["Bäver", "Växt", "Kruka", "Vatten"]));


const sports = [];
sports.push(new Question("Vem vann?", "Jag", ["Arsenal", "Madrid", "Jag", "Du"]));
sports.push(new Question("Vem vann?", "Jag", ["Arsenal", "Madrid", "Jag", "Du"]));

const categoryMap = new Map();
categoryMap.set("Historia", history);
categoryMap.set("Geografi", geography);
categoryMap.set("Vetenskap", science);
categoryMap.set("Sport", sports);

// ClearMainContainer();

// state.currentCategory = history;
// AddQuestionElements();
ShowStartScreen();

function ClearMainContainer() {
    const mainContainer = document.querySelector("#main-container");
    mainContainer.innerHTML = "";
}

function AddQuestion(questionDetails){
    const mainContainer = document.querySelector("#main-container");
    const questionElements = CreateQuestionElements(questionDetails, state.currentQuestion, state.maxQuestions);
    questionElements.forEach(item => mainContainer.appendChild(item));

    AddButtonEvents();
    CreateCountdown();
}
function AddButtonEvents() {
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled === true) return;
            if (button.dataset.correct != null) {
                button.classList.add("correct");
                state.correctAnswers++;
                state.answers.push("Rätt");
                AddResponseMessage("Korrekt!", true);
            }
            else {
                button.classList.add("wrong");
                state.answers.push("Fel");
                AddResponseMessage("Fel svar", false);
            }
            buttons.forEach(btn => {
                btn.disabled = true;
                
            })

            setTimeout(ChangeQuestion, 1000);
        })
    })
}
function ShowStartScreen() {
    ClearMainContainer();
    const mainContainer = document.querySelector("#main-container");
    if (mainContainer.classList.contains("score-screen")) {
        mainContainer.classList.remove("score-screen");
    }
    mainContainer.classList.add("start-screen");
    const categories = [];
    categoryMap.forEach((key,value) => categories.push(value));
    
    const startScreenItems = GenerateStartScreen(categories);
    startScreenItems.forEach(item => mainContainer.appendChild(item));
    AddCategoryButtonEvents();
    const challengeButton = document.querySelector(".challenge-mode-button")
    challengeButton.addEventListener('click', () => {
        const difficulty = document.querySelector("input[name='difficulty']:checked").id;
        StartCategory(challengeButton.id, difficulty);
    })
}
function AddCategoryButtonEvents() {
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = document.querySelector("input[name='difficulty']:checked").id;
            StartCategory(button.id, difficulty);
        })
    })
}
function SetDifficulty(difficulty){
    if (difficulty === "Easy") {
        state.duration = "10s";
    }
    if (difficulty === "Normal") {
        state.duration = "200s";
    }
    if (difficulty === "Hard") {
        state.duration = "3s";
    }
}
function InitializeChallenge() {
    const challengeArray = [];
    categoryMap.forEach(category => {
        category.forEach(question => {
            challengeArray.push(question);
        })
    })
    state.currentCategory = RandomizeOrder(challengeArray);
}
function StartCategory(categoryName, difficulty) {
    SetDifficulty(difficulty);
    if (categoryName === "Secret Challenge") {
        InitializeChallenge();
    }
    else {
        state.currentCategory = categoryMap.get(categoryName);
    }
    state.categoryName = categoryName;
    state.currentQuestion = 0;
    state.correctAnswers = 0;
    state.answers = [];
    state.maxQuestions = state.currentCategory.length;
    document.querySelector("#main-container").classList.remove("start-screen");
    ChangeQuestion(true);
}
function ChangeQuestion(start = false) {
    ClearMainContainer();
    if (start === false) {
        state.currentQuestion++;
    }
    if (state.currentQuestion === state.maxQuestions) {
        EndCategory();
        return;
    }
    const question = state.currentCategory[state.currentQuestion];
    AddQuestion(question);

}
function EndCategory() {
    ClearMainContainer();
    const scoreScreen = document.createElement("div");
    scoreScreen.classList.add("score-summary");
    const categoryText = document.createElement("h4");
    categoryText.textContent = "Kategori: " + state.categoryName;
    scoreScreen.appendChild(categoryText);

    const summary = document.createElement("h2");
    summary.textContent = `Du fick totalt ${state.correctAnswers} rätt på ${state.maxQuestions} frågor!`;
    scoreScreen.appendChild(summary);

    state.answers.forEach((answer, idx) => {
        const p = document.createElement("p");
        const correctClass = answer === "Rätt" ? "summary-correct" : "summary-wrong";
        p.innerHTML = `Fråga ${idx+1}: <span class=${correctClass}>${answer}</span>`;
        scoreScreen.appendChild(p);
    })
    const button = document.createElement("button");
    button.textContent = "Spela igen";
    button.classList.add("score-screen-button");
    
    button.addEventListener('click', ResetToStart);

    const quizContainer = document.querySelector("#main-container");
    quizContainer.classList.add("score-screen");
    quizContainer.appendChild(scoreScreen);
    quizContainer.appendChild(button);
}
function ResetToStart() {
    state.Reset();
    ShowStartScreen();
}
function CreateCountdown() {
    const questionCounter = document.querySelector(".question-counter");
    const countdownBar = document.createElement("div");
    countdownBar.id = "countdown";
    countdownBar.classList.add("progressbar");

    const countdownInner = document.createElement("div");
    countdownInner.classList.add("inner");
    countdownInner.style.animationDuration = state.duration;
    countdownInner.addEventListener("animationend", HandleTimeRanOut);
    countdownBar.appendChild(countdownInner);
    questionCounter.insertAdjacentElement("afterend", countdownBar);
    countdownInner.style.animationPlayState = "running";

}
function HandleTimeRanOut() {
    console.log("Time's up!");
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
        button.classList.add("wrong")
        button.disabled = true;
    });
    state.answers.push("Fel");
    AddResponseMessage("Tyvärr rann tiden ut", false);
    setTimeout(ChangeQuestion, 1000);
}
function AddResponseMessage(message, correct) {
    const p = document.createElement("p");
    p.innerHTML = message;
    p.classList.add("message");
    if (correct) {
        p.style.color = "darkgreen";
    }
    else {
        p.style.color = "red";
    }
    const buttonCounter = document.querySelector(".button-container");
    buttonCounter.insertAdjacentElement("beforebegin", p);
}

import Question from "./Modules/question.js";
import GenerateStartScreen from "./Modules/startScreen.js";
import CreateQuestionElements from "./Modules/questionScreen.js";
import RandomizeOrder from "./Modules/randomizeArray.js";

let apiDifficulty = "medium";
const state = {
    currentQuestion: 0,
    maxQuestions: 0,
    currentCategory: [],
    categoryName: "",
    correctAnswers: 0,
    duration: "5s",
    answers: [],
    historyURL: `https://opentdb.com/api.php?amount=10&category=23&difficulty=${apiDifficulty == undefined ? "" : apiDifficulty}&type=multiple`,
    sportsURL: `https://opentdb.com/api.php?amount=10&category=21&difficulty=${apiDifficulty == undefined ? "" : apiDifficulty}&type=multiple`,
    scienceURL: `https://opentdb.com/api.php?amount=10&category=17&difficulty=${apiDifficulty == undefined ? "" : apiDifficulty}&type=multiple`,
    geographyURL: `https://opentdb.com/api.php?amount=10&category=22&difficulty=${apiDifficulty == undefined ? "" : apiDifficulty}&type=multiple`,
    awaitingAPI: true,
    Reset() {
        this.currentQuestion = 0;
        this.maxQuestions = 0;
        this.currentCategory = [];
        this.categoryName = "";
        apiDifficulty = "medium";
        this.correctAnswers = 0;
        this.duration = "5s";
        this.answers = [];
        
    }
}

let history = [];
const imgTest = new Question("Jättelång frågetext för att se vad som händer om man har jättemycket text i frågan. Kan vi hantera det eller vad är max?",
                             "Lützen", ["Lützen", "Narva", "Breitenfeld", "Lund"], "image", "Slaget vid Lützen", "https://shorturl.at/vKWZ1");
history.push(imgTest);
history.push(new Question("Jättelång frågetext för att se vad som händer om man har jättemycket text i frågan. Kan vi hantera det eller vad är max?", "Karl XII", ["Karl XII", "Karl XI", "Gustav Vasa", "Oscar II"], "text"))

let geography = [];
geography.push(new Question("Fråga om geografi. Vad är svaret?", "Ja", ["Ja", "Nej", "Kanske", "Va?"]));
geography.push(new Question("Fråga om geografi. Vad är svaret?", "Ja", ["Ja", "Nej", "Kanske", "Va?"]));


let science = [];
science.push(new Question("Fråga om vetenskap. Vad är en bäver?", "Bäver", ["Bäver", "Växt", "Kruka", "Vatten"]));
science.push(new Question("Fråga om vetenskap. Vad är en bäver?", "Bäver", ["Bäver", "Växt", "Kruka", "Vatten"]));


let sports = [];
sports.push(new Question("Vem vann?", "Jag", ["Arsenal", "Madrid", "Jag", "Du"]));
sports.push(new Question("Vem vann?", "Jag", ["Arsenal", "Madrid", "Jag", "Du"]));

const api = [];

const categoryMap = new Map();
categoryMap.set("History", history);
categoryMap.set("Geography", geography);
categoryMap.set("Science", science);
categoryMap.set("Sports", sports);

const urlMap = new Map();
urlMap.set("History", state.historyURL);
urlMap.set("Geography", state.geographyURL);
urlMap.set("Science", state.scienceURL);
urlMap.set("Sports", state.sportsURL);
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
            const countdownInner = document.querySelector(".inner");
            countdownInner.style.animationPlayState = "paused";

            if (button.dataset.correct != null) {
                button.classList.add("correct");
                state.correctAnswers++;
                state.answers.push("Correct");
                AddResponseMessage("Korrekt!", true);
            }
            else {
                button.classList.add("wrong");
                document.querySelector("[data-correct]").classList.add("correct");
                state.answers.push("Wrong");
                AddResponseMessage("Fel svar", false);
            }
            buttons.forEach(btn => {
                btn.disabled = true;
                
            })

            setTimeout(ChangeQuestion, 1000);
        })
    })
}
async function ShowStartScreen() {
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
async function GetQuestionsViaApi(url) {
    let success = false;
    let response;
    do {
        response = await fetch(url);
        success = response.ok;
    } while (success === false)
    const result = await response.json();
    const arrayOutput = [];
    result.results.forEach(item => {
        arrayOutput.push(new Question(item.question, item.correct_answer, [item.correct_answer, ...item.incorrect_answers]));
    })
    state.awaitingAPI = false;
    return arrayOutput;

}
function AddCategoryButtonEvents() {
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach(button => {
        if (button.id === "API") {
            button.disabled = state.awaitingAPI;
        }
        button.addEventListener('click', () => {
            const difficultySelected = document.querySelector("input[name='difficulty']:checked").id;
            StartCategory(button.id, difficultySelected);
        })
    })
}
function SetDifficulty(inputDifficulty){
    if (inputDifficulty === "Easy") {
        state.duration = "20s";
        apiDifficulty = "easy";
    }
    if (inputDifficulty === "Normal") {
        state.duration = "10s";
        apiDifficulty = "medium";
    }
    if (inputDifficulty === "Hard") {
        state.duration = "10s";
        apiDifficulty = "hard";
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
async function StartCategory(categoryName, difficulty) {
    SetDifficulty(difficulty);
    if (categoryName === "Secret Challenge") {
        InitializeChallenge();
    }
    else {
        state.currentCategory = RandomizeOrder(await GetQuestionsViaApi(urlMap.get(categoryName))); 
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
    categoryText.textContent = "Category: " + state.categoryName;
    scoreScreen.appendChild(categoryText);

    const summary = document.createElement("h2");
    summary.textContent = `You answered correctly on ${state.correctAnswers} of ${state.maxQuestions} questions!`;
    scoreScreen.appendChild(summary);

    state.answers.forEach((answer, idx) => {
        const p = document.createElement("p");
        const correctClass = answer === "Correct" ? "summary-correct" : "summary-wrong";
        p.innerHTML = `Question ${idx+1}: <span class=${correctClass}>${answer}</span>`;
        scoreScreen.appendChild(p);
    })
    const button = document.createElement("button");
    button.textContent = "Play again";
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
        if (button.dataset.correct) {
            button.classList.add("correct");
        }
        else {
            button.classList.add("wrong")
        }
        button.disabled = true;
    });
    state.answers.push("Wrong");
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

import quizData from './Modules/questions.js';
import backgroundsArray from './Modules/backgrounds.js';
import RandomizeOrder from './Modules/RandomizeArray.js';

const categories = ["Historia", "Sport", "Vetenskap", "Geografi"];

const buttonContainer = document.querySelector('.button-container');
const questionElement = document.querySelector('.question');
const bodyElement = document.querySelector('body');
const welcomeElement = document.querySelector('.welcome');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');

const state = {
  currentQuestionIndex: 0,
  score: 0,
  selectedCategory: null,
  isAnswerSelected: false,
  selectedCategoryQuestions: [],
  timer: undefined,
  highscore: 0,
  lives: 5,
  maxLives: 5,
  mode: "classic",
}


function showCategories() {
  bodyElement.style.backgroundColor = "#92c5ff";
  buttonContainer.innerHTML = '';
  welcomeElement.innerHTML = 'Välkommen'
  document.querySelector('.question').innerHTML = 'Välj kategori';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('buttons')
    button.innerText = category;
    button.addEventListener('click', () => {
      state.selectedCategory = category;
      const retrievedQuestions = quizData.filter(q => q.category === state.selectedCategory);
      state.selectedCategoryQuestions = RandomizeOrder(retrievedQuestions); 
      HideChallengeModes();  
      showQuestion();
    });
    buttonContainer.appendChild(button);
  });

  resetGame();

}

//Lagt till nyckelordet async. Detta för att kunna använda nyckelordet await senare i koden. 
//Vad await gör är att den inväntar det fullständiga svaret från GetQuestionsViaApi innan den går vidare. 
//Utan den hade koden inte fungerat. 
async function showQuestion() {
  state.highscore = localStorage.getItem(`${state.selectedCategory}-highscore`) || 0;
  
  clearTimeout(state.timer);
  if (state.selectedCategory === null) {
    console.error('No category selected.');
    return;
  }
  //Om antalet liv är slut så avslutas quizzet.
  if (state.lives === 0) {
    
    endQuiz();
    return;
  }
  //Om endless är valt och frågorna är slut laddas nya frågor in. 
  else if (state.mode === "endless" 
           && state.currentQuestionIndex === state.selectedCategoryQuestions.length) {
    state.selectedCategoryQuestions = await GetQuestionsViaApi();
    state.currentQuestionIndex = 0;
  }


  if (state.currentQuestionIndex >= state.selectedCategoryQuestions.length) {
    endQuiz();
    return;
  }

  const currentQuestion = state.selectedCategoryQuestions[state.currentQuestionIndex];
  const currentBackground = backgroundsArray[state.currentQuestionIndex % 5];

  //Om endless är valt så uppdateras antalet hjärtan, annars uppdateras frågenumret
  if (state.mode === "endless") {
    UpdateHearts();
  }
  else {
    updateQuestionNumber(state.selectedCategoryQuestions.length);
  }
  

  questionElement.innerHTML = currentQuestion.question;
  bodyElement.style.backgroundColor = currentBackground;

  buttonContainer.innerHTML = '';
  RandomizeOrder(currentQuestion.options).forEach(option => {
    const button = document.createElement('button');
    button.classList.add('buttons');
    button.innerText = option;
    button.addEventListener('click', () => checkAnswer(button, currentQuestion.correctAnswer));
    buttonContainer.appendChild(button);
  });

  progressContainer.classList.remove('hidden');
  startTimer(5, () => handleTimeout(currentQuestion.correctAnswer));

}

function startTimer(duration, callback) {
  let timeRemaining = duration;

  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.animation = 'none';

  progressBar.offsetHeight;

  progressBar.style.animation = `countdown ${duration}s linear`; 

  state.timer = setInterval(() => {
    timeRemaining--;
    if (timeRemaining === 0 && state.isAnswerSelected === false) {
      clearInterval(state.timer);
      callback();
    }
  }, 1000);
}

function handleTimeout(correctAnswer) {
  clearInterval(state.timer);

  const correctOptionButton = Array.from(buttonContainer.children).find(button =>
    button.innerText === correctAnswer
  );

  if (correctOptionButton) {
    correctOptionButton.classList.add('flash-correct');

    setTimeout(() => {
      correctOptionButton.classList.remove('flash-correct');
      state.isAnswerSelected = false;
      state.currentQuestionIndex++;
      showQuestion();
    }, 1000);
  }
  document.querySelectorAll('.buttons').forEach(button => {
    button.disabled = true;
    button.classList.add('disabled');
  }); 
}

function checkAnswer(selectedOption, correctAnswer) {
  if (state.isAnswerSelected) {
    return;
  }

  state.isAnswerSelected = true; 
  progressBar.style.animationPlayState = "paused";
  const isCorrect = selectedOption.innerText === correctAnswer;

  selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');

  document.querySelectorAll('.buttons').forEach(button => {
    button.disabled = true;
    button.classList.add('disabled');
  }); 

  if (!isCorrect) {
    const correctOptionButton = Array.from(buttonContainer.children).find(button =>
      button.innerText === correctAnswer
    );

    //Om endless är valt så reduceras antalet liv och uppdaterar antalet på skärmen.
    if (state.mode === "endless") {
      state.lives--;
      UpdateHearts();
    }

    if (correctOptionButton) {
      correctOptionButton.classList.add('flash-correct');
      setTimeout(() => {
        correctOptionButton.classList.remove('flash-correct');
      }, 1000); 
    }
  }

  setTimeout(() => {
    if (isCorrect) {
      state.score++;

    }

    selectedOption.classList.remove('correct', 'incorrect'); 
    state.currentQuestionIndex++;

     document.querySelectorAll('.buttons').forEach(button => {
      button.disabled = false;
      button.classList.remove('disabled');
    });

    state.isAnswerSelected = false;

    showQuestion();
  }, 1000); 
}

function updateHighscore(reset = false) {
  if (state.score > state.highscore) {
    state.highscore = state.score;
    localStorage.setItem(`${state.selectedCategory}-highscore`, state.highscore);
  }
  if (reset) {
    state.highscore = 0;
    localStorage.setItem(`${state.selectedCategory}-highscore`, state.highscore);
  }
  questionElement.innerHTML = `<p>Du fick: ${state.score} poäng.</p> <p>Highscore för ${state.selectedCategory}: ${state.highscore} poäng.</p>`;
}

function updateQuestionNumber(totalQuestions) {
  const questionNumberElement = document.querySelector('.welcome');
  if (questionNumberElement) {
    questionNumberElement.textContent = `Fråga: ${state.currentQuestionIndex + 1}/${totalQuestions}`;
  }
}

function resetGame() {
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.mode = "classic";
  state.lives = 5;
  state.selectedCategory = null;
  state.selectedCategoryQuestions = [];
  ShowChallengeModes();
  
  clearTimeout(state.timer);
  document.querySelector('.timer-container').classList.add('hidden');
}

function endQuiz() {
  updateHighscore(); 
  progressBar.style.animation = 'none';
  progressBar.offsetHeight; 
  progressBar.style.animation = '';
  progressContainer.classList.add('hidden');
  buttonContainer.innerHTML = '';
  
  bodyElement.style.backgroundColor = "#ffd166";
  buttonContainer.classList.add('play-again-button-container');

  const playAgainButton = document.createElement('button');
  playAgainButton.classList.add('play-again-button');
  playAgainButton.innerText = 'Spela igen';
  playAgainButton.addEventListener('click', () => {
    showCategories();
  });

  buttonContainer.appendChild(playAgainButton);
  const resetHighscore = document.createElement('button');
  resetHighscore.classList.add('buttons');
  resetHighscore.innerText = 'Återställ highscore';
  resetHighscore.addEventListener('click', () => {
    updateHighscore(true);
  });
  buttonContainer.appendChild(resetHighscore);
}

updateHighscore();
showCategories();
InitializeAPIModes();

//API modes nedanför

//Denna metod hämtar in data från ett api som gjorts tillgängligt av Open Trivia Database. 
//För att kunna hämta data från en annan server behöver vi invänta serverns svar innan vi går vidare, därav async och await. 
//Använda en do while loop för att hämta datan utifall att apin fick ett fel av något slag. 
//Efter datan hämtats in omvandlas den till det format som resten av koden behöver för att fungera. 
async function GetQuestionsViaApi(num = 10) {
    const url = `https://opentdb.com/api.php?amount=${num}&difficulty=medium&type=multiple`;
    let success = false;
    let response;
    do {
        response = await fetch(url);
        success = response.ok;
    } while (success === false)
    const result = await response.json();
    const arrayOutput = [];
    result.results.forEach(item => {
        const question = {question: item.question, options: [item.correct_answer, ...item.incorrect_answers], correctAnswer: item.correct_answer};
        arrayOutput.push(question);
    })
    return arrayOutput;
}
function HideChallengeModes() {
  const challengeElements = document.querySelectorAll(".challenges");
  challengeElements.forEach(el => el.classList.add("hidden"));
}
function ShowChallengeModes() {
  const challengeElements = document.querySelectorAll(".challenges");
  challengeElements.forEach(el => el.classList.remove("hidden"));

}

function InitializeAPIModes() {
    const endlessButton = document.querySelector("#endless");
    const challengeButton = document.querySelector("#challenge");
    challengeButton.addEventListener('click', StartChallenge);
    endlessButton.addEventListener("click", StartEndless);
}

async function StartChallenge() {
    state.selectedCategory = "Utmaning";
    state.mode = "challenge";
    HideChallengeModes()
    state.selectedCategoryQuestions = await GetQuestionsViaApi(50);
    showQuestion();
}

async function StartEndless() {
  state.selectedCategory = "Oändlig";
  state.mode = "endless";
  HideChallengeModes()
  state.selectedCategoryQuestions = await GetQuestionsViaApi();
  showQuestion();
}

function UpdateHearts() {
  const heartImage = "./Images/heart.png";
  const emptyHeartImage = "./Images/heart_empty.png";
  welcomeElement.innerHTML = "";
  welcomeElement.classList.add("lives");
  
  for (let i = 0; i < state.lives; i++) {
    const img = document.createElement("img");
    img.src = heartImage;
    img.alt = "Heart icon";
    welcomeElement.appendChild(img)
  }
  for (let i = 0; i < state.maxLives - state.lives; i++ ) {
    const img = document.createElement("img");
    img.src = emptyHeartImage;
    img.alt = "Empty heart icon";
    welcomeElement.appendChild(img)
  }
}
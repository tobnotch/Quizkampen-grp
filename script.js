import quizData from './questions.js';
import RandomizeOrder from './RandomizeArray.js';

const categories = ["Historia", "Sport", "Vetenskap", "Geografi"];

const categoryContainer = document.querySelector('.category-container'); 
const buttonContainer = document.querySelector('.button-container');
const questionElement = document.querySelector('.question');
const welcomeElement = document.querySelector('.welcome');
const quizContainer = document.querySelector('.quiz-container');
const timerContainer = document.querySelector('.timer-container');
const timerElement = document.querySelector('.timer');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');

let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;
let isAnswerSelected = false;
let selectedCategoryQuestions = [];
let timer;
let highscore = 0;


function showCategories() {
  buttonContainer.innerHTML = '';
  welcomeElement.innerHTML = 'Välkommen'
  document.querySelector('.question').innerHTML = 'Välj kategori';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('buttons')
    button.innerText = category;
    button.addEventListener('click', () => {
      selectedCategory = category;
      const retrievedQuestions = quizData.filter(q => q.category === selectedCategory);
      selectedCategoryQuestions = RandomizeOrder(retrievedQuestions);    
      showQuestion();
    });
    buttonContainer.appendChild(button);
  });

  resetGame();

}

function showQuestion() {
  highscore = localStorage.getItem(`${selectedCategory}-highscore`) || 0;
  console.log(highscore);
  
  clearTimeout(timer);
  if (selectedCategory === null) {
    console.error('No category selected.');
    return;
  }

  if (currentQuestionIndex < selectedCategoryQuestions.length) {
    const currentQuestion = selectedCategoryQuestions[currentQuestionIndex];

    updateQuestionNumber(selectedCategoryQuestions.length);

    questionElement.innerHTML = currentQuestion.question;

    buttonContainer.innerHTML = '';
    RandomizeOrder(currentQuestion.options).forEach(option => {
      const button = document.createElement('button');
      button.classList.add('buttons');
      button.innerText = option;
      button.addEventListener('click', () => checkAnswer(button, currentQuestion.correctAnswer));
      buttonContainer.appendChild(button);
    });

    progressContainer.classList.remove('hidden');
    timerContainer.classList.remove('hidden');
    startTimer(5, () => handleTimeout(currentQuestion.correctAnswer));

  } else {
    endQuiz();
  }
}

function startTimer(duration, callback) {
  let timeRemaining = duration;

  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.animation = 'none';

  progressBar.offsetHeight;

  progressBar.style.animation = `countdown ${duration}s linear`; 

  timer = setInterval(() => {
    timeRemaining--;
    if (timeRemaining === 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

/*
function startTimer(duration, callback) {
  let timeRemaining = duration;
  timerElement.innerText = `Tid: ${timeRemaining}s`;

  timer = setInterval(() => {
    timeRemaining--;
    timerElement.innerText = `Tid: ${timeRemaining}s`;

    if (timeRemaining === 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}
*/
function handleTimeout(correctAnswer) {
  clearInterval(timer);

  const correctOptionButton = Array.from(buttonContainer.children).find(button =>
    button.innerText === correctAnswer
  );

  if (correctOptionButton) {
    correctOptionButton.classList.add('flash-correct');

    setTimeout(() => {
      correctOptionButton.classList.remove('flash-correct');
      isAnswerSelected = false;
      currentQuestionIndex++;
      showQuestion();
    }, 1000);
  }
}

function checkAnswer(selectedOption, correctAnswer) {
  if (isAnswerSelected) {
    return;
  }

  isAnswerSelected = true; 

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

    if (correctOptionButton) {
      correctOptionButton.classList.add('flash-correct');
      setTimeout(() => {
        correctOptionButton.classList.remove('flash-correct');
      }, 1000); 
    }
  }

  setTimeout(() => {
    if (isCorrect) {
      score++;
      updateHighscore(); 
    }

    selectedOption.classList.remove('correct', 'incorrect'); 
    currentQuestionIndex++;

     document.querySelectorAll('.buttons').forEach(button => {
      button.disabled = false;
      button.classList.remove('disabled');
    });

    isAnswerSelected = false;

    showQuestion();
  }, 1000); 
}

function updateHighscore() {
  if (score > highscore) {
    highscore = score;
    localStorage.setItem(`${selectedCategory}-highscore`, highscore);
  }
}

function updateQuestionNumber(totalQuestions) {
  const questionNumberElement = document.querySelector('.welcome');
  if (questionNumberElement) {
    questionNumberElement.textContent = `Fråga: ${currentQuestionIndex + 1}/${totalQuestions}`;
  }
}

function resetGame() {
  currentQuestionIndex = 0;
  score = 0;
  selectedCategory = null;
  selectedCategoryQuestions = [];
  clearTimeout(timer);
  timerElement.innerHTML = 'Tid: 5s';
  document.querySelector('.timer-container').classList.add('hidden');
}

function endQuiz() {

  progressBar.style.animation = 'none';
  progressBar.offsetHeight; 
  progressBar.style.animation = '';
  progressContainer.classList.add('hidden');

  timerContainer.classList.add('hidden');
  buttonContainer.innerHTML = '';
  questionElement.innerHTML = `Du fick: ${score} poäng. <br> Highscore för ${selectedCategory}: ${highscore} poäng.`;

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
  localStorage.removeItem(`${selectedCategory}-highscore`);
  });
  buttonContainer.appendChild(resetHighscore);
}

updateHighscore();
showCategories();
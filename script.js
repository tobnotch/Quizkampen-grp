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
const highscoreContainer = document.querySelector('.highscore-container')
const highscoreElement = document.querySelector('.highscore')

let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;
let isAnswerSelected = false;
let selectedCategoryQuestions = [];
let timer;

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
}

function showQuestion() {

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

    timerContainer.classList.remove('hidden');
    let timeRemaining = 5;
    const timerElement = document.querySelector('.timer');
    timerElement.innerText = `Tid: ${timeRemaining}s`;

    timer = setInterval(() => {
      timeRemaining--;
      timerElement.innerText = `Tid: ${timeRemaining}s`;

      if (timeRemaining === 0) {
        clearInterval(timer);
        handleTimeout(currentQuestion.correctAnswer);
      }
    }, 1000);

  } else {
    endQuiz();
  }
}

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

function updateQuestionNumber(totalQuestions) {
  const questionNumberElement = document.querySelector('.welcome');
  if (questionNumberElement) {
    questionNumberElement.textContent = `Fråga: ${currentQuestionIndex + 1}/${totalQuestions}`;
  }
}

function endQuiz() {

  timerContainer.classList.add('hidden');

  buttonContainer.innerHTML = '';
  questionElement.innerHTML = `Du fick: ${score} poäng`;

  buttonContainer.classList.add('play-again-button-container');

  const playAgainButton = document.createElement('button');
  playAgainButton.classList.add('play-again-button');
  playAgainButton.innerText = 'Spela igen';
  playAgainButton.addEventListener('click', () => {

    currentQuestionIndex = 0;
    score = 0;
    selectedCategory = null;
    selectedCategoryQuestions = [];
    clearTimeout(timer);
    document.querySelector('.timer').innerHTML = 'Tid: 5s'
    showCategories();
  });
  buttonContainer.appendChild(playAgainButton);
}

showCategories();
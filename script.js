import quizData from './questions.js';

const categories = ["Historia", "Sport", "Vetenskap", "Geografi"];

const categoryContainer = document.querySelector('.category-container'); 
const buttonContainer = document.querySelector('.button-container');
const questionElement = document.querySelector('.question');
const welcomeElement = document.querySelector('.welcome');
const quizContainer = document.querySelector('.quiz-container');

let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;

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
      showQuestion();
    });
    buttonContainer.appendChild(button);
  });
}

function showQuestion() {
  if (selectedCategory === null) {
    console.error('No category selected.');
    return;
  }
  
  const selectedCategoryQuestions = quizData.filter(q => q.category === selectedCategory);

  if (currentQuestionIndex < selectedCategoryQuestions.length) {
    const currentQuestion = selectedCategoryQuestions[currentQuestionIndex];

    updateQuestionNumber(selectedCategoryQuestions.length);

    questionElement.innerHTML = currentQuestion.question;

    buttonContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('buttons');
      button.innerText = option;
      button.addEventListener('click', () => checkAnswer(button, currentQuestion.correctAnswer));
      buttonContainer.appendChild(button);
    });
  } else {
    endQuiz();
  }
}

function checkAnswer(selectedOption, correctAnswer) {
  const isCorrect = selectedOption.innerText === correctAnswer;

  selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');

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
    showQuestion();
  }, 1000); 
}

/*
function checkAnswer(selectedOption, correctAnswer) {
  const isCorrect = selectedOption.innerText === correctAnswer;

  selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');

  setTimeout(() => {
    if (isCorrect) {
      score++;
    }

    selectedOption.classList.remove('correct', 'incorrect');
    currentQuestionIndex++;
    showQuestion();
  }, 1000);
}
*/

function updateQuestionNumber(totalQuestions) {
  const questionNumberElement = document.querySelector('.welcome');
  if (questionNumberElement) {
    questionNumberElement.textContent = `Fråga: ${currentQuestionIndex + 1}/${totalQuestions}`;
  }
}

function endQuiz() {
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

    showCategories();
  });
  buttonContainer.appendChild(playAgainButton);
}

showCategories();
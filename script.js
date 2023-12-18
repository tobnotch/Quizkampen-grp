import quizData from './questions.js';
import RandomizeOrder from './RandomizeArray.js';

const categories = ["Historia", "Sport", "Vetenskap", "Geografi"];

const buttonContainer = document.querySelector('.button-container');
const questionElement = document.querySelector('.question');
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
}


function showCategories() {
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
      showQuestion();
    });
    buttonContainer.appendChild(button);
  });

  resetGame();

}

function showQuestion() {
  state.highscore = localStorage.getItem(`${state.selectedCategory}-highscore`) || 0;
  console.log(state.highscore);
  
  clearTimeout(state.timer);
  if (state.selectedCategory === null) {
    console.error('No category selected.');
    return;
  }

  if (state.currentQuestionIndex < state.selectedCategoryQuestions.length) {
    const currentQuestion = state.selectedCategoryQuestions[state.currentQuestionIndex];

    updateQuestionNumber(state.selectedCategoryQuestions.length);

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

  state.timer = setInterval(() => {
    timeRemaining--;
    if (timeRemaining === 0) {
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
  questionElement.innerHTML = `Du fick: ${state.score} poäng. <br> Highscore för ${state.selectedCategory}: ${state.highscore} poäng.`;
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
  state.selectedCategory = null;
  state.selectedCategoryQuestions = [];
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
import { setLocalStorage, getLocalStorage, shuffle, disableBtn, getRandomInt, showWindow } from "./helpers.js";

// Pages

const scorePage = document.querySelector('#score-page');
const splashPage = document.querySelector('#splash-page');
const countdownPage = document.querySelector('#countdown-page');
// Splash Page
const startForm = document.querySelector('#start-form');
const radioContainers = document.querySelectorAll('.radio-container');
// Countdown Page

// Game Page
const itemContainer = document.querySelector('.item-container');
const itemFooter = document.querySelector('.item-footer');

// Equations

let equationsArray = [];
let equations = 0;
let playerGuessArray = [];
let bestScoresArray = [
  { questions: 10, bestScore: 0 },
  { questions: 25, bestScore: 0 },
  { questions: 50, bestScore: 0 },
  { questions: 99, bestScore: 0 },
];
// Game Page


let wrongFormat = [];
// Scroll
let valueY = 0;

// Time
let time = 0;
let stopwatch;
const startStopwatch = () => stopwatch = setInterval(() => time += 0.1, 100);
const stopStopwatch = () => clearInterval(stopwatch);

const resetValues = () => {
  valueY = 0;
  equations = 0;
  time = 0;
  equationsArray = [];
  playerGuessArray = [];
  wrongFormat = [];
}


const startCountDown = (sec) => {
  const countdown = document.querySelector('.countdown');
  showWindow(countdownPage);
  countdown.textContent = sec;
  const timer = setInterval(() => {
    countdown.textContent = --sec;
    if (sec == 0) countdown.textContent = 'GO!';
    if (sec < 0) {
      clearInterval(timer);
      startGame();
    }
  }, 1000);
};
// Create Correct/Incorrect Random Equations
function createEquations(equations) {
  let firstNumber = 0;
  let secondNumber = 0;
  let equationObject = {};
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(1, equations);
  // Set amount of wrong equations
  const wrongEquations = equations - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(0, 11);
    secondNumber = getRandomInt(0, 11);;
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: true };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(0, 11);
    secondNumber = getRandomInt(0, 11);;
    const equationValue = firstNumber * secondNumber;
    if (i & 2) {
      wrongFormat[i] = `${firstNumber} x ${secondNumber + getRandomInt(1, 5)} = ${equationValue}`;
    } else if (i & 3) {
      wrongFormat[i] = `${firstNumber} x ${secondNumber} = ${equationValue - getRandomInt(1, 5)}`;
    } else {
      wrongFormat[i] = `${firstNumber + getRandomInt(1, 5)} x ${secondNumber} = ${equationValue}`;
    }
    const equation = wrongFormat[i];
    equationObject = { value: equation, evaluated: false };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}


// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  addEquationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function addEquationsToDOM() {
  equationsArray.forEach(eq => {
    const item = document.createElement('div');
    item.classList.add('item');
    const equation = document.createElement('h1');
    equation.textContent = `${eq.value}`;
    item.append(equation);
    itemContainer.append(item);
  });
}

function startGame() {
  const gamePage = document.querySelector('#game-page');
  createEquations(equations);
  populateGamePage();
  showWindow(gamePage);
  itemContainer.scroll(0, valueY);
  disableBtn(itemFooter, false);
  startStopwatch(stopwatch);
}


function getScoreData() {
  const penaltyTime = penalty();
  const score = (time + +penaltyTime).toFixed(1);
  const baseTime = time.toFixed(1);
  return { penaltyTime, score, baseTime };
}
function setBestScoreData(data) {
  const equationItem = bestScoresArray.find(item => item.questions == equations);
  if (+equationItem.bestScore === 0) equationItem.bestScore = +data.score;
  else if (+equationItem.bestScore > data.score) equationItem.bestScore = +data.score;
  setLocalStorage('bestScore', bestScoresArray);
}
function showScore() {
  const scoreData = getScoreData();
  stopStopwatch(stopwatch);
  generateMarkupScore(scoreData);
  showWindow(scorePage);
  setBestScoreData(scoreData);
}
function penalty() {
  return equationsArray.filter((item, i) => item.evaluated !== playerGuessArray[i]).length;
}

function generateMarkupScore(data) {
  const markup = `
    <div class="score-container">
      <h1 class="title">Your Time</h1>
      <h1 class="final-time">${data.score}s</h1>
      <h1 class="base-time">Base Time: ${data.baseTime}s</h1>
      <h1 class="penalty-time">Penalty: +${data.penaltyTime}.0s</h1>
    </div>
    <div class="score-footer">
      <button class="play-again">Play Again</button>
    </div>
  `;
  scorePage.insertAdjacentHTML('afterbegin', markup);
}

function select(boolean) {
  playerGuessArray.push(boolean);
  valueY += 80;
  if ((equations * 80) === (valueY)) {
    disableBtn(itemFooter, true);
    showScore();
    resetValues();
    return;
  }
  itemContainer.scroll(0, valueY);
}
function selectRadioEl(radioEl) {
  radioContainers.forEach(radio => {
    radio.classList.remove('selected-label');
    if (radioEl == radio) radio.classList.add('selected-label');
  });
}
function findSelectedEl() {
  return [...radioContainers].find(radio => radio.classList.contains('selected-label'));
}

function updateSplashPage() {
  startForm.querySelectorAll('.best-score-value').forEach((item, i) => {
    item.textContent = `${(bestScoresArray[i].bestScore).toFixed(1)}s`
  });
}

startForm.addEventListener('click', (e) => {
  const radioEl = e.target.closest('.radio-container');
  if (radioEl) selectRadioEl(radioEl);
});

startForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selectedElem = findSelectedEl();
  if (!selectedElem) return;

  equations = +selectedElem.querySelector('input').value;
  selectedElem.classList.remove('selected-label');
  startForm.reset();

  startCountDown(3);
});

itemFooter.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const boolean = btn.dataset.answer ? true : false;
  select(boolean);
});

scorePage.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  updateSplashPage();
  showWindow(splashPage);

});
(function init() {
  const localStoreData = getLocalStorage('bestScore');
  if (localStoreData) bestScoresArray = localStoreData;
  updateSplashPage();
})();

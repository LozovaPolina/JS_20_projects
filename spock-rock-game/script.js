import { startConfetti, stopConfettiInner } from "./confetti.js";

const playerScoreEl = document.querySelector('#playerScore');
const playerChoiceEl = document.querySelector('#playerChoice');

const computerScoreEl = document.querySelector('#computerScore');
const computerChoiceEl = document.querySelector('#computerChoice');
const computerChoices = document.querySelectorAll('#computer > i');

const resultText = document.querySelector('.result-text');
const allGameIcons = document.querySelectorAll('.far')

const choices = [
  { name: 'rock', defeats: ['scissors', 'lizard'] },
  { name: 'paper', defeats: ['rock', 'spock'] },
  { name: 'scissors', defeats: ['paper', 'lizard'] },
  { name: 'lizard', defeats: ['paper', 'spock'] },
  { name: 'spock', defeats: ['scissors', 'rock'] },
];
let computerScoreNum = 0;
let playerScoreNum = 0;

//set random computer choice
function computerRandomChoice() {
  const compChoiceNum = Math.ceil(Math.random() * 10 / 2);
  const computerChoice = choices[compChoiceNum - 1];
  let choiceEl = '';

  computerChoices.forEach(item => {
    if (item.dataset.choice == computerChoice.name) return choiceEl = item;
  });

  showChoice(choiceEl, computerChoiceEl, computerChoice.name);
  return computerChoice.name;
}

function showChoice(selected, elem, choice) {
  selected.classList.add('selected');
  elem.textContent = ` --- ${choice[0].toUpperCase() + choice.slice(1)}`;
}

// Check result, icrease scores, update resultText
function updateScore(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    resultText.textContent = "It's a tie."
  } else {
    const choice = choices.find(item => item.name === playerChoice);
    choice.defeats.includes(computerChoice) ? showResult() : showResult(false);
  }
}
function showResult(won = true) {
  won ? startConfetti() : '';
  const scoreEl = won ? playerScoreEl : computerScoreEl;
  scoreEl.textContent =`${won ? ++playerScoreNum : ++computerScoreNum}`;
  resultText.textContent = `${won ? 'You won!' : 'You Lost!'}`
}

function resetSelected() {
  stopConfettiInner();
  allGameIcons.forEach(icon => icon.classList.remove('selected'));
}
function resetAll() {
  resetSelected();
  resultText.textContent = 'Start game!';
  computerScoreNum = playerScoreNum = 0;
  playerScoreEl.textContent = computerScoreEl.textContent = 0;
  playerChoiceEl.textContent = computerChoiceEl.textContent = ` --- Choice`;
}

function checkResult(playerChoice) {
  resetSelected();
  const computerChoice = computerRandomChoice();
  updateScore(playerChoice, computerChoice);
}

document.querySelector('.player-container').addEventListener('click', (e) => {
  const target = e.target;
  const playerChoice = e.target.closest('i') ? e.target.dataset.choice : false;

  if (!playerChoice) return;

  checkResult(playerChoice);
  showChoice(target, playerChoiceEl, playerChoice);
});
document.querySelector('.reset-icon').addEventListener('click', resetAll);

(function init() {
  resetAll();
})();



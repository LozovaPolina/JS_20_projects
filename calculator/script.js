const clacDisplay = document.querySelector('h1'),
    btnsContainer = document.querySelector('.calculator-buttons');

const calculate = {
    '/': (firstNum, secNum) => firstNum / secNum,
    '*': (firstNum, secNum) => firstNum * secNum,
    '+': (firstNum, secNum) => firstNum + secNum,
    '-': (firstNum, secNum) => firstNum - secNum,
    '=': (secNum) => secNum,
};

let firstValue = 0,
    operatorValue = '',
    awaitingNextValue = false;

function sendNumValue(num) {
    if (awaitingNextValue) {
        clacDisplay.textContent = num;
        awaitingNextValue = false;
    } else {
        const displayValue = clacDisplay.textContent;
        clacDisplay.textContent = displayValue === '0' ? num : displayValue + num;
    }

}
function addDecimal() {
    if (awaitingNextValue) return;
    if (clacDisplay.textContent.includes('.')) return;
    clacDisplay.textContent = `${clacDisplay.textContent}.`;

}
function resetAll() {
    clacDisplay.textContent = '0';
    firstValue = 0;
    operatorValue = '';
    awaitingNextValue = false;
}


function useOperator(operator) {
    const curValue = +clacDisplay.textContent;
    if (operatorValue && awaitingNextValue) operatorValue = operator;
    if (!firstValue) {
        firstValue = +curValue;
    } else {
        const calculation = calculate[operatorValue](firstValue, curValue);
        clacDisplay.textContent = calculation;
        firstValue = calculation;
    }
    operatorValue = operator;
    awaitingNextValue = true;

}

btnsContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.number')) sendNumValue(target.value);
    if (target.closest('.operator')) useOperator(target.value);
    if (target.closest('.decimal')) addDecimal();
    if (target.closest('#clear-btn')) resetAll();
});




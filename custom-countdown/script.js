const inputContainer = document.querySelector('.input-container');
const countdown = document.querySelector('.countdown')
const completeContainer = document.querySelector('.complete');

const countdownData = {}
const today = new Date().toISOString().split('T')[0];




function showWindow(classSelector) {
    const container = document.querySelector('.container');
    const containerItems = container.querySelectorAll('div');

    containerItems.forEach(item => {
        item.classList.add('hidden');
        if (item.matches(classSelector)) item.classList.remove('hidden');
    });
}


const getTimeDate = (data) => {
    let t = new Date(data.countdown).getTime() - new Date();
    if (t <= 0) t = 0;
    const timer = setInterval(() => {
        t === 0 ? clearInterval(timer) : createTimer(data);
    }, 1000);

    const hour = 1000 * 60 * 60;
    const days = Math.floor(t / (hour * 24) % 30),
        hours = Math.floor((t / hour) % 24),
        min = Math.floor((t / (1000 * 60)) % 60),
        sec = Math.floor((t / 1000) % 60);
    return { t, days, hours, min, sec }
};


function createTimer(data) {
    const timeData = getTimeDate(data);
    countdown.innerHTML = `
            <h1 class="countdown-title">${data.title}</h1>
            <ul class="time-container">
                <li><span>${addZero(timeData.days)}</span>${timeData.days == 1 ? 'Day' : 'Days'}</li>
                <li><span>${addZero(timeData.hours)}</span>${timeData.hours == 1 ? 'Hour' : 'Hours'}</li>
                <li><span>${addZero(timeData.min)}</span>${timeData.min == 1 ? 'Minute' : 'Minutes'}</li>
                <li><span>${addZero(timeData.sec)}</span>${timeData.sec == 1 ? 'Second' : 'Seconds'}</li>
            </ul>
            <button class="countdown-button">Reset</button>
    `;
    if (timeData.t === 0) {
        showWindow('.complete');
        createCompletePopap();
    };
}
function createCompletePopap() {
    completeContainer.innerHTML = `
            <h1 class="complete-title">Countdown Complete!</h1>
            <h1 class="complete-info">Countdown Finished on ${today}</h1>
            <button class="complete-button">New Countdown</button>
    `;
    
}


function btnListener(elem, classSlector) {
    elem.addEventListener('click', (e) => {
        e.preventDefault();
        if (!e.target.closest(classSlector)) return;
        showWindow('.input-container');
        removeLocalStorage('timer');
    });
}


inputContainer.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!formValidation(this)) return;
    this.querySelectorAll('input').forEach(input => countdownData[input.id] = input.value);
    setLocalStorage('timer', countdownData);
    this.reset();
    showWindow('.countdown');
    createTimer(countdownData);
});

btnListener(countdown, '.countdown-button');
btnListener(completeContainer, '.complete-button');

(function init() {
    const dateEl = document.querySelector('#countdown');
    dateEl.setAttribute('min', today);
    const localStorage = getLocalStorage('timer');
    !localStorage ? showWindow('.input-container') : createTimer(localStorage);
})();
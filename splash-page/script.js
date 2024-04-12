const { body } = document;
const backgroundToggles = document.querySelector('.background-toggles');

function changeBackground(num) {
    if (body.classList.contains(`background-${num}`)) {
        body.className = '';
        return;
    }
    body.className = '';
    body.classList.add(`background-${num}`);
}

backgroundToggles.addEventListener('click', (e) => {
    const btnNum = e.target.closest('[data-background]') ? +e.target.dataset.background : false;
    if (!btnNum) return;
    changeBackground(btnNum);
});
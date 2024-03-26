const toggleSwitch = document.querySelector('input[type="checkbox"]');
const navContainer = document.querySelector('#nav');
const imageContainer = document.querySelectorAll('.image-container > img');
const toggleIcon = document.querySelector('#toggle-icon');
const textBox = document.querySelector('#text-box')


const toggleIconClass = function (...classes) {
    classes.forEach(item => {
        toggleIcon.children[1].classList.toggle(item);
    });
};

function switchMode(mode = 'dark') {
    const white = 'rgb(255 255 255 / 50%)';
    const black = 'rgb(0 0 0 / 50%)';
    const state = mode === 'dark' ? 'light' : 'dark';

    navContainer.style.backgroundColor = mode === 'dark' ? black : white;
    textBox.style.backgroundColor = mode === 'dark' ? white : black;
    toggleIcon.children[0].textContent = mode === 'dark' ? `Dark Mode` : `Light Mode`;
    toggleIconClass('fa-sun', 'fa-moon')
    imageContainer.forEach(img => {
        img.src = img.getAttribute('src').replaceAll(`${state}`, mode);
    });
}
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        switchMode();
        setLocalStorage('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        switchMode('light');
        setLocalStorage('light');
    }
}
toggleSwitch.addEventListener('change', switchTheme);

function setLocalStorage(value) {
    localStorage.setItem('theme', value);
}
(function () {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme);
    switchMode(theme);
})();
const menu = document.querySelector('#menu-bars');
const overlay = document.querySelector('#overlay');
const navBar = document.querySelector('nav');
const navList = document.querySelectorAll('nav > ul > li')

const toggleClasses = function (item, addClass, removeClass) {
    item.classList.add(addClass);
    item.classList.remove(removeClass);
}
const toggleNav = function () {
    menu.classList.toggle('change');
    if (menu.classList.contains('change')) {
        toggleClasses(overlay, 'overlay-slide-right', 'overlay-slide-left');
        navList.forEach((item, i) => toggleClasses(item, `slide-in-${i + 1}`, `slide-out-${i + 1}`));
    } else {
        toggleClasses(overlay, 'overlay-slide-left', 'overlay-slide-right');
        navList.forEach((item, i) => toggleClasses(item, `slide-out-${i + 1}`, `slide-in-${i + 1}`))
    }
};


menu.addEventListener('click', toggleNav);
navBar.addEventListener('click', (e) => {
    if (!e.target.closest('li')) return;
    toggleNav();
});


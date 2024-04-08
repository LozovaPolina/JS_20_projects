const setLocalStorage = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
}
const getLocalStorage = (name) => {
    return JSON.parse(localStorage.getItem(name))
}
const shuffle = (array) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}
const disableBtn = (container, boolean) => {
    container.querySelectorAll('button').forEach(btn => btn.disabled = boolean);
}
const getRandomInt = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
function showWindow(elem, hideSelector = '.card') {
    document.querySelectorAll(hideSelector).forEach(card => card.classList.add('hidden'));
    elem.classList.remove('hidden');
}

export { setLocalStorage, getLocalStorage, shuffle, disableBtn, getRandomInt, showWindow };
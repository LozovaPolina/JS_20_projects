function addZero(num) {
    return num > 9 ? num : `0${num}`;
}
function formValidation(form) {
    let valid = []
    form.querySelectorAll('input').forEach(input => {
        if (!input.value.trim()) {
            input.style.cssText = `
                border: 2px solid rgb(163, 29, 29);
            `;
            valid.push(false);
        } else {
            input.style.cssText = `
                border: 2px solid #006959;
            `;
            valid.push(true);
        }
    });
    return valid.every(item => item === true)
}
function setLocalStorage(name,data) {
    localStorage.setItem(name, JSON.stringify(data))
}
function removeLocalStorage(name) {
    localStorage.removeItem(name);
}
function getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
}
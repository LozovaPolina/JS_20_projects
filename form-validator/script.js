const form = document.querySelector('form');
const passswordElems = form.querySelectorAll('[type="password"]');
const messageContainer = document.querySelector('.message-container');


function validateForm() {
    const isValid = form.checkValidity();
    let passwordMatch = false
    if (!isValid) {
        renderMessage(false,'Please fill out all fields');
        return;
    }
    if (passswordElems[0].value === passswordElems[1].value) {
        passwordMatch = true;
        passswordElems.forEach(elem => elem.style.borderColor = 'green');
    } else {
        passwordMatch = false;
        renderMessage(false, 'Make sure passwords match');
        passswordElems.forEach(elem => elem.style.borderColor = 'red');
        return;
    }

    if (isValid && passwordMatch) {
        renderMessage(true, 'Successfully Registered');
        return true;
    }
}
function renderMessage(type = true, message) {
    messageContainer.innerHTML = ` 
        <div class="message ${type ? ' success-message' : 'error-message'}">
            <p>${message}</p>
        </div>
    `;
}
function storeFormData() { 
    const formData = {};
    for (const [key, value] of new FormData(form)) {
        formData[key] = value;
    }
}

function processFormData(e) {
    e.preventDefault();
    if (!validateForm()) return;
    storeFormData();
}


form.addEventListener('submit', processFormData);

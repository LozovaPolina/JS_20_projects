
const btnBookmark = document.querySelector('.btn-bookmark');
const modalContainer = document.querySelector('.modal-container');
const bookmarkForm = modalContainer.querySelector('.bookmark-form');
const container = document.querySelector('.container');

let bookmarks = [];

function showModal() {
    modalContainer.classList.add('show-modal');
    modalContainer.querySelector('input').focus();
}
function closeModal() {
    modalContainer.classList.remove('show-modal');
}
function setLocalStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}
function getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name));
}
function setInputBorder(input, color) {
    input.style.cssText = `border: 2px solid ${color};`;
}

function validateUrl(ulrValue) {
    const input = bookmarkForm.querySelector('#websiteUrl');
    const massege = bookmarkForm.querySelector('.massage-validation');
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!ulrValue.match(regex)) {
        setInputBorder(input, 'rgb(163, 29, 29)');
        massege.classList.remove('hidden')
        return false;
    }
    setInputBorder(input, '#006959');
    massege.classList.add('hidden');
    return true;
}

function getInputsData(form = bookmarkForm) {
    const obj = {}
    form.querySelectorAll('input')
        .forEach(input => obj[input.id] = input.value);
    return obj;
}

function cheakFormInputs(form = bookmarkForm) {
    let valid = [];
    form.querySelectorAll('input').forEach(input => {
        if (!input.value.trim()) {
            setInputBorder(input, 'rgb(163, 29, 29)');
            valid.push(false);
        } else {
            setInputBorder(input, '#006959');
            valid.push(true);
        }
    });
    return valid.every(item => item === true);
}
function storeBookmark(e) {
    e.preventDefault()
    if (!cheakFormInputs()) return;
    let { websiteName, websiteUrl } = getInputsData();

    if (!websiteUrl.includes('https://')
        && !websiteUrl.includes('http://')) {
        websiteUrl = `https://${websiteUrl}`;
    }
    if (!validateUrl(websiteUrl)) return;

    const bookmark = {
        name: websiteName,
        url: websiteUrl,
    };
    closeModal();
    bookmarks.push(bookmark);
    setLocalStorage('bookmarks', bookmarks);
    renderBookmarks();
    bookmarkForm.reset();

}

function renderBookmarks() {
    let html = ``;

    bookmarks.forEach(item => {
        const domainName = `www.${item.url.replace(/http\/\/:|https:\/\//g, '')}`;
        html += `
            <div class="item">
             <i class="fas fa-times" data-close="${item.url}" title="close"></i>
                <div class="name">
                    <img src="https://s2.googleusercontent.com/s2/favicons?domain=${domainName}" alt="favicon">
                    <a href="${item.url}" target="_blank">${item.name}</a>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function deleteBookmark(url) {
    bookmarks = bookmarks.filter(item => item.url !== url);
    setLocalStorage('bookmarks', bookmarks);
    renderBookmarks();
}





container.addEventListener('click', (e) => {
    if (!e.target.closest('[data-close]')) return;
    const url = e.target.dataset.close;
    deleteBookmark(url);
});

btnBookmark.addEventListener('click', showModal);

modalContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-close]')
        || e.target.matches('.modal-container');
    if (!btn) return;
    closeModal();
});
bookmarkForm.addEventListener('submit', storeBookmark);

function init() {
    const storageData = getLocalStorage('bookmarks');
    if (!storageData) return;
    bookmarks = storageData;
    renderBookmarks();
};
init();

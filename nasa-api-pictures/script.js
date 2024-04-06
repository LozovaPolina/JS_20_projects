const navContainer = document.querySelector('.navigation-container');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const API_KEY = `DEMO_KEY`;
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: 'instant',
    });
    if (page === 'results') {
        document.querySelector('[data-nav="results"]').classList.remove('hidden');
        document.querySelector('[data-nav="favorites"]').classList.add('hidden');
    } else {
        document.querySelector('[data-nav="results"]').classList.add('hidden');
        document.querySelector('[data-nav="favorites"]').classList.remove('hidden');
    }

    loader.classList.add('hidden');
}
let resultArray = [];
let favorites = {};

function updateDOM(page) {
    const storagedData = getLocalStorage('nasaFavorites');;
    if (storagedData) {
        favorites = storagedData;
    }
    renderMarkup(page);
    showContent(page);
}
function renderMarkup(page) {
    const currentArray = page === 'results' ? resultArray : Object.values(favorites);
    let markup = ``;
    currentArray.forEach(result => {
        markup += `
            <div class="card">
                <a href="${result.hdurl}" title="View Full Omage" target="_blank">
                    <img src="${result.url}" loading="lazy" alt="NASA Picture of the Day" class="card-img-top">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <p class="clickable"${page === 'results' ? 'data-save' : 'data-remove'}="${result.url}"> ${page === 'results' ? 'Add to Favorites' : 'Remove Favorite'}</p>
                    <p class="card-text">${result.explanation}</p>
                    <small class="text-muted">
                        <strong>${result.date}</strong>
                        <span>${result.copyright || 'Anonymous'}</span>
                    </small>
                </div>
            </div>
        `;
    });
    imagesContainer.innerHTML = '';
    imagesContainer.insertAdjacentHTML('afterbegin', markup);
}

imagesContainer.addEventListener('click', (e) => {
    const btnFavorite = e.target.closest('[data-save]');
    if (btnFavorite) addToFavorites(btnFavorite);

    const btnRemove = e.target.closest('[data-remove]');
    if (btnRemove) removeFavorite(btnRemove);
});

navContainer.addEventListener('click', (e) => {
    if (e.target.closest('[data-nav="toFavorites"]')) updateDOM('favorites');
    if (e.target.closest('[data-nav="load"]')) getNasaPictures();
})
function addToFavorites(btn) {
    const itemUrl = btn.dataset.save;
    const item = resultArray.find(item => item.url === itemUrl && !favorites[itemUrl]);
    if (!item) return;

    favorites[itemUrl] = item;
    toggleSaveConfirmed(2000);
    setLocalStorage('nasaFavorites', favorites);
}
function removeFavorite(btn) {
    const itemUrl = btn.dataset.remove;
    if (!favorites[itemUrl]) return;
    delete favorites[itemUrl];
    setLocalStorage('nasaFavorites', favorites);
    updateDOM('favorites');
}
function setLocalStorage(name, data) {
    localStorage.setItem(name, JSON.stringify(data))
}
function getLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
}
function toggleSaveConfirmed(ms) {
    saveConfirmed.classList.remove('hidden');
    setTimeout(() => {
        saveConfirmed.classList.add('hidden');
    }, ms);
}
async function getNasaPictures() {
    loader.classList.remove('hidden');
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error();
        resultArray = await res.json();

        updateDOM('results');
    } catch (err) {
        console.log(err);
    }
}
getNasaPictures();



const imageContainer = document.querySelector('.image-container');
const container = document.querySelector('.container');
const error = document.createElement('div');
// const loader = document.querySelector('.loader');



const photoData = {
    page: 1,
    photos: '',
};
const apiData = {
    count: 10,
    apiKey: 'W9Zq9EHBuy_yGyM-NCHhtN7LYYd_GZavh_KSXUe5iQw',
    collectionId: '67540869',
    getApiUrl() {
        return `https://api.unsplash.com/collections/${this.collectionId}/photos/?page=${photoData.page}&client_id=${this.apiKey}&count=${this.count}`
    }
};


const lastPhotoObserver = new IntersectionObserver(entries => {
    const lastPhoto = entries[0];
    if (!lastPhoto.isIntersecting) return;
    renderPhotos();
    lastPhotoObserver.unobserve(lastPhoto.target);
}, {})

function setAttributes(elem, attributes) {
    for (const key in attributes) {
        elem.setAttribute(key, attributes[key])
    }
}
const displayPhotos = function () {
    if (!photoData.photos) return;
    photoData.photos.forEach(photo => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });

        const img = document.createElement('img');
        const loader = document.createElement('div');
        loader.classList.add('loader');
        item.append(img);
        imageContainer.append(item);
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

    });
    lastPhotoObserver.observe(document.querySelector('.image-container > a:last-child'))

}

const getPhotos = async function (url) {
    try {
        const request = await fetch(url);
        if (!request.ok) throw new Error('Lost connect with server');
        const data = await request.json();
        return data;
    } catch (err) {
        renderError(err);
        addHandlerBtn();
    }
};


const renderPhotos = async function () {
    const data = await getPhotos(apiData.getApiUrl());
    photoData.photos = data;
    displayPhotos();
    photoData.page++
};

function renderError(err) {
    error.classList.add('error');
    error.innerHTML = `
            <div class="error__message">
                <h2 class="error__message-descr">Something went wrong. ${err.message}</h2>
                <h3 class="error__message-suggest">Please try again</h3>
            </div>
    `;
    container.append(error);
}


function addHandlerBtn() {
    const btn = document.createElement('button');
    btn.textContent = `Load images`;
    container.append(btn)
    btn.addEventListener('click', function () {
        renderPhotos();
        this.remove();
    });
};

const init = function () {
    addHandlerBtn();
};
init();



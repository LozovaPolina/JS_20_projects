// Get Ouotes from API
const quotInput = document.querySelector('#quote');
const quoteContainer = document.querySelector('.quote-container')
const authorInput = document.querySelector('#author');
const quotBtn = document.querySelector('#new-quote');
const twitterBtn = document.querySelector('#twitter');
const loader = document.querySelector('#loader')
let qouts = [];


const randomNum = function (num) {
    return Math.floor(Math.random() * Math.floor(num))
};
const showLoadingSpinner = function () {
    loader.classList.remove('hidden');
    quoteContainer.classList.add('hidden');
};
const hideLoadingSpinner = function () {
    loader.classList.add('hidden');
    quoteContainer.classList.remove('hidden');
};
const getQuots = async function (url) {
    try {
        showLoadingSpinner();
        const request = await fetch(url);
        
        if (!request.ok) throw new Error('Something went wrong');

        const res = await request.json();
        return await res
    } catch (err) {
        alert(err.message);
    }
};

const renderQuot = function (quots) {
    
    const { text, author } = quots[randomNum(quots.length)];
    if (text.length > 120) {
        quotInput.classList.add('long-quote');
    } else {
        quotInput.classList.remove('long-quote');
    }
    quotInput.textContent = text;
    authorInput.textContent = author;
    hideLoadingSpinner();
};

const tweetQuot = function () {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quotInput.textContent} - ${authorInput.textContent}`;
    window.open(twitterUrl, '_blank');
};

quotBtn.addEventListener('click', async () => {
    const quots = await getQuots('https://jacintodesign.github.io/quotes-api/data/quotes.json');
    renderQuot(quots);
});
twitterBtn.addEventListener('click', tweetQuot);

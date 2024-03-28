const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const playerControls = document.querySelector('.player-controls')
// Current Song
let songIndex = 0;
// Music
const songs = [
  {
    name: 'jacinto-1',
    displayName: 'Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    displayName: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    displayName: 'Front Row (Remix)',
    artist: 'Metric/Jacinto Design',
  },
];

// Check if Playing
let isPlaying = false;


function toggleIcon(curIcon, btn) {
    const changeTo = curIcon === 'fa-play' ? 'fa-pause' : 'fa-play';
    const title = curIcon.slice(3);
    btn.classList.replace(curIcon, changeTo);
    btn.setAttribute('title', title);
}

// Play
function playSong(btn) {
    toggleIcon('fa-play', btn);
    music.play();
}

// Pause
function pauseSong(btn) {
    toggleIcon('fa-pause', btn);
    music.pause();
}

function togglePauseSong(btn) {
    isPlaying = isPlaying ? false : true;
    isPlaying ? playSong(btn) : pauseSong(btn);
}

playerControls.addEventListener('click', (e) => {
    const btn = e.target.closest('i');
    if (!btn) return;
    btn.matches('#next') || btn.matches('#prev') ? changeSong(btn) : togglePauseSong(btn);
});
// Update DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
}



// Change Song
const prevSong = () => --songIndex < 0 ? songIndex = songs.length - 1 : songIndex;
const nextSong = () => ++songIndex > songs.length - 1 ? songIndex = 0 : songIndex;

function changeSong(btn) {
    btn.id ==='next' ? nextSong() : prevSong();
    loadSong(songs[songIndex]);
    playSong();
}

function addZero(num) {
    return num < 10 ? num = `0${num}` : num;
}

function getMinSec(time) {
    const min = Math.floor(time / 60);
    const sec = addZero(Math.floor(time % 60));
    return { min, sec };
}

// Update Progress Bar & Time
function updateProgressBar(e) {
    if (!isPlaying) return;
    
      
    const { duration, currentTime } = e.srcElement;
    if (!duration) return;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for duration
    const { min: durMin, sec: durSec } = getMinSec(duration);
    // Delay switching duration Element to avoid NaN
    durationEl.textContent = `${durMin}:${durSec}`;

    // Calculate display for currentTime
    const { min: curMin, sec: curSec } = getMinSec(currentTime);
    currentTimeEl.textContent = `${curMin}:${curSec}`;
  
}

// Set Progress Bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

(function init() {
    music.addEventListener('ended', nextSong);
    music.addEventListener('timeupdate', updateProgressBar);
    progressContainer.addEventListener('click', setProgressBar);
    loadSong(songs[songIndex]);
})();



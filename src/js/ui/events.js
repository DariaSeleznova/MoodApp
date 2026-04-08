
import { loadBooks, loadMovies, loadMusic, loadSeries, loadTrendingContent } from '../controllers/moodController';
import { nextMovie, prevMovie, nextSeries, prevSeries } from './render';


document.getElementById('next-movie').addEventListener('click', nextMovie);
document.getElementById('prev-movie').addEventListener('click', prevMovie);
document.getElementById('next-series').addEventListener('click', nextSeries);
document.getElementById('prev-series').addEventListener('click', prevSeries);
const moodButtons = document.querySelectorAll('.mood-btn');

document.addEventListener('DOMContentLoaded', () => {
    loadTrendingContent();
    updateMoreLinks();
    setupSwipeNavigation('movies-list', prevMovie, nextMovie);
    setupSwipeNavigation('series-list', prevSeries, nextSeries);
});

moodButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const moodValue = btn.dataset.mood;
        handleMoodChange(moodValue);
    });
});

let currentMood = null;
async function handleMoodChange(mood) {
    currentMood = mood;
    setActiveMoodButton(mood);
    applyMoodClass(mood);
    loadMovies(mood);
    loadSeries(mood);
    loadMusic(mood);
    loadBooks(mood);

    updateMoreLinks();
}

function applyMoodClass(mood) {
    const moodClasses = ['happy', 'relaxed', 'excited', 'spirited', 'tired', 'sad']
        .map(name => `mood-${name}`);

    document.body.classList.remove(...moodClasses);

    if (mood) {
        document.body.classList.add(`mood-${mood}`);
    }
}

function setActiveMoodButton(mood) {
    moodButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.mood === mood);
    });
}

export function resetAppState() {
    currentMood = null;
    setActiveMoodButton(null);
    applyMoodClass(null);
    loadTrendingContent();
    updateMoreLinks();
}

export function getCurrentMood() {
    return currentMood;
}

function updateMoreLinks() {
    const links = document.querySelectorAll('.more-link');

    links.forEach(link => {
        const type = link.dataset.type;

        if (currentMood) {
            link.href = `list.html?type=${type}&mood=${currentMood}`;
        } else {
            link.href = `list.html?type=${type}`;
        }
    });
}
export function showMoviesLoading() {
    document.querySelector('.movies-loader')?.classList.remove('hidden');
}

export function hideMoviesLoading() {
    document.querySelector('.movies-loader')?.classList.add('hidden');
}
export function showSeriesLoading() {
    document.querySelector('.series-loader')?.classList.remove('hidden');
}
export function hideSeriesLoading() {
    document.querySelector('.series-loader')?.classList.add('hidden');
}
export function showBooksLoading() {
    document.querySelector('.books-loader')?.classList.remove('hidden');
}
export function hideBooksLoading() {
    document.querySelector('.books-loader')?.classList.add('hidden');
}
export function showMusicLoading() {
    document.querySelector('.music-loader')?.classList.remove('hidden');
}
export function hideMusicLoading() {
    document.querySelector('.music-loader')?.classList.add('hidden');
}

function setupSwipeNavigation(containerId, onSwipeRight, onSwipeLeft) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const mobileMedia = window.matchMedia('(max-width: 426px)');
    let startX = 0;
    let startY = 0;
    let isTracking = false;

    container.addEventListener('touchstart', (event) => {
        if (!mobileMedia.matches || event.touches.length !== 1) {
            return;
        }

        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        isTracking = true;
    }, { passive: true });

    container.addEventListener('touchend', (event) => {
        if (!isTracking || !mobileMedia.matches || event.changedTouches.length !== 1) {
            return;
        }

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        isTracking = false;

        if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) {
            return;
        }

        if (deltaX > 0) {
            onSwipeRight();
            return;
        }

        onSwipeLeft();
    }, { passive: true });

    container.addEventListener('touchcancel', () => {
        isTracking = false;
    }, { passive: true });
}



import { loadBooks, loadMovies, loadMusic, loadSeries, loadTrendingContent } from '../controllers/moodController';
import { nextMovie, prevMovie, nextSeries, prevSeries } from './render';


document.getElementById('next-movie').addEventListener('click', nextMovie);
document.getElementById('prev-movie').addEventListener('click', prevMovie);
document.getElementById('next-series').addEventListener('click', nextSeries);
document.getElementById('prev-series').addEventListener('click', prevSeries);
const moodButtons = document.querySelectorAll('.mood-btn');

document.addEventListener('DOMContentLoaded', () => {
    loadTrendingContent();
});

moodButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const moodValue = e.target.dataset.mood;
        handleMoodChange(moodValue);
    });
});

async function handleMoodChange(mood) {
    loadMovies(mood);
    loadSeries(mood);
    loadMusic(mood);
    loadBooks(mood);;
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


import { getContentByMood } from '../controllers/moodController';
import { renderMovies, renderMusic, renderSeries, renderBooks, nextMovie, prevMovie, nextSeries, prevSeries } from './render';

document.getElementById('next-movie').addEventListener('click', nextMovie);
document.getElementById('prev-movie').addEventListener('click', prevMovie);
document.getElementById('next-series').addEventListener('click', nextSeries);
document.getElementById('prev-series').addEventListener('click', prevSeries);
const moodButtons = document.querySelectorAll('.mood-btn');

moodButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const moodValue = e.target.dataset.mood;
        handleMoodChange(moodValue);
    });
});

async function handleMoodChange(mood) {
    const data = await getContentByMood(mood);

    renderMovies(data.movies);
    renderSeries(data.series);
    renderBooks(data.books);
    renderMusic(data.music);
}

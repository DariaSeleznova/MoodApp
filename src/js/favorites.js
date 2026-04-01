import '../styles/main.scss';
import { getFavorites, removeFromFavorites } from './services/favoritesService';
import { updateTexts } from '../js/i18n/i18n.js';

const favorites = getFavorites();

const movies = favorites.filter(item => item.type === 'movie');
const series = favorites.filter(item => item.type === 'series');
const music = favorites.filter(item => item.type === 'music');
const books = favorites.filter(item => item.type === 'book');

function renderFavorites(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!list.length) {
        const typeLabels = {
            movie: 'movies',
            series: 'series',
            music: 'music',
            book: 'books'
        };

        const type = containerId.replace('fav-', '');
        const label = typeLabels[type] || 'items';

        container.innerHTML = `
        <div class="empty-state">
            <p data-i18n="noFavoritesYet">😢 You have no favorite ${label} yet</p>
            <a href="index.html" data-i18n="goExplore">Go explore →</a>
        </div>
    `;

        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('fav-card');

        const imageUrl = item.image
            ? item.image.startsWith('http')
                ? item.image
                : `https://image.tmdb.org/t/p/w200${item.image}` // TMDB
            : null;
        card.innerHTML = `
            <div class="fav-card__image">
                ${imageUrl
                ? `<img src="${imageUrl}" />`
                : `<div class="fav-card__placeholder">⭐</div>`
            }
            </div>

            <div class="fav-card__actions">
                <a href="${item.link}" target="_blank" class="fav-btn" data-i18n="trailer">
  ▶ Trailer
</a>

                <button class="fav-btn remove-btn">❌</button>
            </div>
        `;
        const removeBtn = card.querySelector('.remove-btn');

        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            removeFromFavorites(item.id);
            card.remove();
        });
        container.appendChild(card);
    });
}
renderFavorites(movies, 'fav-movies');
renderFavorites(series, 'fav-series');
renderFavorites(music, 'fav-music');
renderFavorites(books, 'fav-books');

updateTexts();

import '../styles/main.scss';
import { getFavorites, removeFromFavorites } from './services/favoritesService';
import { getCurrentUser, initAuthState, subscribeToAuthState } from './services/authService.js';
import { updateTexts } from '../js/i18n/i18n.js';
import logo from '../assets/icons/logo.png';

function renderFavorites(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!list.length) {
        const emptyMessages = {
            movie: 'noFavoriteMovies',
            series: 'noFavoriteSeries',
            music: 'noFavoriteMusic',
            book: 'noFavoriteBooks'
        };

        const typeMap = {
            'fav-movies': 'movie',
            'fav-series': 'series',
            'fav-music': 'music',
            'fav-books': 'book'
        };

        const type = typeMap[containerId];
        const key = emptyMessages[type];

        container.innerHTML = `
        <div class="empty-state">
            <p data-i18n="${key}">😢</p>
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
               ${item.link ? `
                <a href="${item.link}" target="_blank" class="movie-card__action" data-i18n="trailer"> ▶ Trailer </a>` : ''}

                <button class="fav-btn remove-btn">❌</button>
            </div>
        `;
        const removeBtn = card.querySelector('.remove-btn');

        removeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();

            await removeFromFavorites(item.id, getCurrentUser());

            const updatedList = getFavorites().filter(i => i.type === item.type);

            const containerId = `fav-${item.type}s`;

            renderFavorites(updatedList, containerId);
        });

        container.appendChild(card);
    });
}

function renderAllFavorites() {
    const favorites = getFavorites();

    renderFavorites(favorites.filter(item => item.type === 'movie'), 'fav-movies');
    renderFavorites(favorites.filter(item => item.type === 'series'), 'fav-series');
    renderFavorites(favorites.filter(item => item.type === 'music'), 'fav-music');
    renderFavorites(favorites.filter(item => item.type === 'book'), 'fav-books');
}

initAuthState();
renderAllFavorites();
subscribeToAuthState(() => {
    renderAllFavorites();
});

updateTexts();

const backLogo = document.querySelector('.back-logo img');
if (backLogo) backLogo.src = logo;

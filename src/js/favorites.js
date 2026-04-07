import '../styles/main.scss';
import { getFavorites, removeFromFavorites } from './services/favoritesService';
import { updateTexts } from '../js/i18n/i18n.js';
import logo from '../assets/icons/logo.png';

function loadAuthService() {
    return import('./services/authService.js');
}

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
    const isMobile = window.innerWidth <= 1023;
    const limit = isMobile ? 2 : list.length;

    const visibleItems = list.slice(0, limit);
    const hiddenItems = list.slice(limit);

    visibleItems.forEach(item => {
        const card = createFavoriteCard(item);
        container.appendChild(card);
    });

    let expanded = false;

    if (hiddenItems.length > 0) {
        const moreBtn = document.createElement('button');
        moreBtn.classList.add('fav-more-btn');
        moreBtn.setAttribute('data-i18n', 'more');
        moreBtn.textContent = 'More';

        moreBtn.addEventListener('click', () => {
            if (!expanded) {
                hiddenItems.forEach(item => {
                    const card = createFavoriteCard(item);
                    container.insertBefore(card, moreBtn);
                });
                moreBtn.setAttribute('data-i18n', 'less');
                updateTexts();
                expanded = true;
            } else {
                renderFavorites(list, containerId);
            }
        });
        container.appendChild(moreBtn);
        updateTexts();

    }
}

function createFavoriteCard(item) {
    const card = document.createElement('div');
    card.classList.add('fav-card');

    const imageUrl = item.image
        ? item.image.startsWith('http')
            ? item.image
            : `https://image.tmdb.org/t/p/w200${item.image}`
        : null;

    const title = item.title;
    const subtitle = item.subtitle;
    const linkData = getLinkData(item);

    card.innerHTML = `
        <div class="fav-card__image">
            ${imageUrl
            ? `<img src="${imageUrl}" />`
            : `<div class="fav-card__placeholder">⭐</div>`
        }
        </div>

        <div class="fav-card__info">
            <h3 class="fav-card__title">${title}</h3>
            <p class="fav-card__subtitle">${subtitle}</p>

            <div class="fav-card__actions">
                ${linkData ? `
                    <a href="${linkData.url}" 
                    target="_blank" 
                    class="fav-card__action ${linkData.className}" 
                    data-i18n="${linkData.textKey}">
                    ${linkData.defaultText}
                    </a>
                ` : ''}

                <button class="fav-btn remove-btn">❌</button>
            </div>
        </div>
    `;

    const removeBtn = card.querySelector('.remove-btn');

    removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const { getCurrentUser } = await loadAuthService();

        await removeFromFavorites(item.id, getCurrentUser());

        const updatedList = getFavorites().filter(i => i.type === item.type);
        const containerId = `fav-${item.type}`;

        renderFavorites(updatedList, containerId);
    });

    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });

    return card;
}


function getLinkData(item) {
    if (item.link) {
        return {
            url: item.link,
            textKey: 'trailer',
            defaultText: '▶ Trailer',
            className: 'fav-trailer btn-primary'
        };
    }

    if (item.previewLink) {
        return {
            url: item.previewLink,
            textKey: 'preview',
            defaultText: '📚 Preview',
            className: 'btn-preview'
        };
    }
    if (item.listenLink) {
        return {
            url: item.listenLink,
            textKey: 'listen',
            defaultText: '🎵 Listen',
            className: 'music-card__btn'
        }
    }

    return null;
}

function renderAllFavorites() {
    const favorites = getFavorites();

    renderFavorites(favorites.filter(item => item.type === 'movie'), 'fav-movies');
    renderFavorites(favorites.filter(item => item.type === 'series'), 'fav-series');
    renderFavorites(favorites.filter(item => item.type === 'music'), 'fav-music');
    renderFavorites(favorites.filter(item => item.type === 'book'), 'fav-books');
}

renderAllFavorites();
void loadAuthService().then(({ initAuthState, subscribeToAuthState }) => {
    initAuthState();
    subscribeToAuthState(() => {
        renderAllFavorites();
    });
});

updateTexts();

const backLogo = document.querySelector('.back-logo img');
if (backLogo) backLogo.src = logo;

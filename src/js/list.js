import '../styles/main.scss';
import {
    getMoviesByMood,
    getTrendingMovies,
    getSeriesByMood,
    getTrendingSeries,
    getMovieDetails,
    getSeriesDetails,
    getTrailerUrl
} from './services/movieService';
import { getBooksByMood, getTrendingBooks } from './services/bookService';
import { getMusicByMood, getTrendingMusic } from './services/musicService';
import { setupFavoriteButton } from './utils/favoriteHandler.js';
import { updateTexts, translate } from './i18n/i18n.js';
import logo from '../assets/icons/logo.png';
import imgBook from '../assets/icons/imgBook.png';
import { renderFavoriteButton, renderImage, renderTrailerButton } from './utils/renderHelper.js';

const params = new URLSearchParams(window.location.search);

const type = params.get('type');
const mood = params.get('mood') || null;
const title = document.getElementById('page-title');
const container = document.getElementById('list-container');

function loadAuthService() {
    return import('./services/authService.js');
}

void loadAuthService().then(({ initAuthState }) => {
    initAuthState();
});

async function loadList() {
    const listConfig = {
        movies: {
            loadMood: getMoviesByMood,
            loadTrending: getTrendingMovies,
            render: renderMoviesList
        },
        series: {
            loadMood: getSeriesByMood,
            loadTrending: getTrendingSeries,
            render: renderSeriesList
        },
        books: {
            loadMood: getBooksByMood,
            loadTrending: getTrendingBooks,
            render: renderBooksList
        },
        music: {
            loadMood: getMusicByMood,
            loadTrending: getTrendingMusic,
            render: renderMusicList
        }
    };

    const config = listConfig[type];

    if (!config) {
        title.innerHTML = `<p data-i18n="invalidType"></p>`;
        updateTexts();
        return;
    }

    title.textContent = mood
        ? `${translate(mood)} ${translate(type)}`
        : `${translate('trending')} ${translate(type)}`;

    try {
        let data;

        if (mood) {
            data = await config.loadMood(mood, 20);
        } else {
            data = await config.loadTrending(20);
        }

        await config.render(data);

    } catch (error) {
        console.error('Load list error:', error);

        const container = document.querySelector('#list-container');

        container.innerHTML = `
            <div class="error-state">
                <p data-i18n="loadError">Something went wrong. Please try again.</p>
                <button class="btn-retry">Retry</button>
            </div>
        `;

        updateTexts();

        const retryBtn = container.querySelector('.btn-retry');
        retryBtn.addEventListener('click', loadList);
    }
}

loadList();

updateTexts();

const backLogo = document.querySelector('.back-logo img');
if (backLogo) backLogo.src = logo;

const scrollToTopBtn = document.getElementById('scroll-to-top');

function toggleScrollToTopButton() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

scrollToTopBtn.addEventListener('click', scrollToTop);
window.addEventListener('scroll', toggleScrollToTopButton);

async function renderMoviesList(movies) {
    container.innerHTML = '';

    const moviesWithTrailers = await Promise.all(
        movies.map(async (movie) => {
            try {
                const details = await getMovieDetails(movie.id);

                return {
                    movie,
                    trailerUrl: getTrailerUrl(details.videos?.results)
                };
            } catch (error) {
                return {
                    movie,
                    trailerUrl: null
                };
            }
        })
    );

    moviesWithTrailers.forEach(({ movie, trailerUrl }) => {
        const card = document.createElement('div');
        card.classList.add('list-card');
        card.dataset.id = String(movie.id);
        card.dataset.type = 'movie';

        const imageUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : '';

        card.innerHTML = `
          ${renderImage(imageUrl, movie.title, '🎬')}

            <div class="list-card__info">
                <h3>${movie.title}</h3>
                                <p class="list-card__rating">⭐ ${movie.vote_average}</p>
                                <p class="list-card__description">${movie.overview || translate('noDescription')}</p>
                <div class="list-card__actions">
                    ${renderTrailerButton(trailerUrl)}
                    ${renderFavoriteButton(movie.id, 'movie')}
                </div>
            </div>
        `;

        const favBtn = card.querySelector('.btn-fav');
        const trailerBtn = card.querySelector('.btn-trailer');

        setupTrailerButton(trailerBtn, trailerUrl);

        setupFavoriteButton(favBtn, {
            id: movie.id,
            title: movie.title,
            image: movie.poster_path,
            type: 'movie',
            rating: movie.vote_average,
            link: trailerUrl || undefined
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('button, a')) {
                return;
            }

            card.classList.toggle('active');
        });

        container.appendChild(card);
    });

    updateTexts();
}

async function renderSeriesList(series) {
    container.innerHTML = '';

    const seriesWithTrailers = await Promise.all(
        series.map(async (show) => {
            try {
                const details = await getSeriesDetails(show.id);

                return {
                    show,
                    trailerUrl: getTrailerUrl(details.videos?.results)
                };
            } catch (error) {
                return {
                    show,
                    trailerUrl: null
                };
            }
        })
    );

    seriesWithTrailers.forEach(({ show, trailerUrl }) => {
        const card = document.createElement('div');
        card.classList.add('list-card');
        card.dataset.id = String(show.id);
        card.dataset.type = 'series';

        const imageUrl = show.poster_path
            ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
            : '';

        card.innerHTML = `
            ${renderImage(imageUrl, show.name, '📺')}

            <div class="list-card__info">
                <h3>${show.name}</h3>
                <p class="list-card__rating">⭐ ${show.vote_average}</p>
                <div class="list-card__actions">
                    ${renderTrailerButton(trailerUrl)}
                    ${renderFavoriteButton(show.id, 'series')}
                </div>
            </div>
        `;

        const favBtn = card.querySelector('.btn-fav');
        const trailerBtn = card.querySelector('.btn-trailer');

        setupTrailerButton(trailerBtn, trailerUrl);

        setupFavoriteButton(favBtn, {
            id: show.id,
            title: show.name,
            image: show.poster_path,
            type: 'series',
            rating: show.vote_average,
            link: trailerUrl || undefined
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('button, a')) {
                return;
            }

            card.classList.toggle('active');
        });

        container.appendChild(card);
    });

    updateTexts();
}

function renderMusicList(tracks) {
    container.innerHTML = '';

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.classList.add('list-card');
        card.dataset.id = String(track.url);
        card.dataset.type = 'music';

        const imageUrl = track.image;

        card.innerHTML = `
            ${renderImage(imageUrl, track.name, '🎵')}
            <div class="list-card__info">
                <h3>${track.name}</h3>
                <p>${track.artist.name}</p>
                <a href="${track.url}" target="_blank" rel="noopener noreferrer" class="music-card__btn" data-i18n="listen">🎵 Listen</a>
            </div>
                ${renderFavoriteButton(track.url, 'music')}
        `;

        const favBtn = card.querySelector('.btn-fav');

        setupFavoriteButton(favBtn, {
            id: track.url,
            title: track.name,
            image: track.image,
            type: 'music',
            link: track.url
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('button, a')) {
                return;
            }

            card.classList.toggle('active');
        });


        container.appendChild(card);
    });

    updateTexts();
}

function renderBooksList(books) {
    container.innerHTML = '';

    books.forEach(book => {
        const title = book.title;
        const authors = book.authors
            ?.map(a => a.name)
            .join(', ') || translate('unknownAuthor');
        const previewLink = book.key
            ? `https://openlibrary.org${book.key}`
            : '#';
        const image = book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : null;

        const card = document.createElement('div');
        card.classList.add('list-card');
        card.dataset.id = String(book.key || title);
        card.dataset.type = 'book';

        card.innerHTML = `
        ${renderImage(image, title, `<img src="${imgBook}" alt="${title}" />`)}

            <div class="list-card__info">
                <h3>${title}</h3>
                <p>${authors}</p>
                <a href="${previewLink}" target="_blank" rel="noopener noreferrer" class="btn-preview" data-i18n="preview">📚 Preview</a>
            </div>
                ${renderFavoriteButton(book.key || title, 'book')}
        `;

        const favBtn = card.querySelector('.btn-fav');

        setupFavoriteButton(favBtn, {
            id: book.key || title,
            title: title,
            subtitle: authors,
            image: image,
            type: 'book',
            previewLink
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('button, a')) {
                return;
            }

            card.classList.toggle('active');
        });

        container.appendChild(card);
    });

    updateTexts();
}

function setupTrailerButton(button, trailerUrl) {
    if (!button || !trailerUrl) {
        return;
    }

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(trailerUrl, '_blank', 'noopener,noreferrer');
    });
}

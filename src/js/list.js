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
import { isFavorite } from './utils/favoritesStorage.js';
import { setupFavoriteButton } from './utils/favoriteHandler.js';
import { updateTexts, translate } from './i18n/i18n.js';
import logo from '../assets/icons/logo.png';

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
        title.innerHTML = `
        <p data-i18n="invalidType"></p>
    `;

        updateTexts();
        return;
    }

    title.textContent = mood
        ? `${translate(mood)} ${translate(type)}`
        : `${translate('trending')} ${translate(type)}`;

    let data;

    if (mood) {
        data = await config.loadMood(mood, 20);
    } else {
        data = await config.loadTrending(20);
    }

    await config.render(data);
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

        const imageUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : '';

        card.innerHTML = `
            <div class="list-card__image">
                ${imageUrl
                ? `<img src="${imageUrl}" alt="${movie.title}" />`
                : `<div class="list-card__placeholder">🎬</div>`
            }
            </div>

            <div class="list-card__info">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average}</p>
                <p>${movie.overview || translate('noDescription')}</p>
                <div class="list-card__actions">
                    ${trailerUrl ? '<button class="btn btn-primary btn-trailer" data-i18n="trailer"></button>' : ''}
                    <button class="btn-fav ${isFavorite(movie.id) ? 'active' : ''}">
                      <svg class="heart" viewBox="0 0 32 32">
                        <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
                      </svg>
                    </button>
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

        const imageUrl = show.poster_path
            ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
            : '';

        card.innerHTML = `
            <div class="list-card__image">
                ${imageUrl
                ? `<img src="${imageUrl}" alt="${show.name}" />`
                : `<div class="list-card__placeholder">📺</div>`}
            </div>

            <div class="list-card__info">
                <h3>${show.name}</h3>
                <p>⭐ ${show.vote_average}</p>
                <div class="list-card__actions">
                    ${trailerUrl ? '<button class="btn btn-primary btn-trailer" data-i18n="trailer"></button>' : ''}
                    <button class="btn-fav ${isFavorite(show.id) ? 'active' : ''}">
                      <svg class="heart" viewBox="0 0 32 32">
                        <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
                      </svg>
                    </button>
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

        const imageUrl = track.image;

        card.innerHTML = `
            <div class="list-card__image">
                ${imageUrl
                ? `<img src="${imageUrl}" />`
                : `<div class="list-card__placeholder">🎵</div>`}
            </div>

            <div class="list-card__info">
                <h3>${track.name}</h3>
                <p>${track.artist.name}</p>
            </div>
                <button class="btn-fav ${isFavorite(track.url) ? 'active' : ''}">
                  <svg class="heart" viewBox="0 0 32 32">
                    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
                  </svg>
                </button>
        `;

        const favBtn = card.querySelector('.btn-fav');

        setupFavoriteButton(favBtn, {
            id: track.url,
            title: track.name,
            image: track.image,
            type: 'music',
            link: track.url
        });


        container.appendChild(card);
    });
}

function renderBooksList(books) {
    container.innerHTML = '';

    books.forEach(book => {
        const info = book.volumeInfo;

        const card = document.createElement('div');
        card.classList.add('list-card');
        card.dataset.id = String(book.id);

        card.innerHTML = `
            <div class="list-card__image">
                ${info.imageLinks?.thumbnail
                ? `<img src="${info.imageLinks.thumbnail}" />`
                : `<div class="list-card__placeholder">📚</div>`}
            </div>

            <div class="list-card__info">
                <h3>${info.title}</h3>
                <p>${info.authors?.join(', ')}</p>
            </div>
                <button class="btn-fav ${isFavorite(book.id) ? 'active' : ''}">
                  <svg class="heart" viewBox="0 0 32 32">
                    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
                  </svg>
                </button>
        `;

        const favBtn = card.querySelector('.btn-fav');

        setupFavoriteButton(favBtn, {
            id: book.id,
            title: info.title,
            image: info.imageLinks?.thumbnail,
            type: 'book',
            link: info.previewLink
        });

        container.appendChild(card);
    });
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

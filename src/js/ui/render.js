import { isFavorite } from '../services/favoritesService';
import { translate, updateTexts } from '../../js/i18n/i18n.js';
import { setupFavoriteButton } from '../utils/favoriteHandler.js';
import { getMovieDetails, getSeriesDetails, getTrailerUrl } from '../services/movieService';

const AUTOPLAY_DELAY = 30000;

let currentIndex = 0;
let moviesData = [];
let moviesAutoplayId = null;
let isMoviesHovered = false;
let moviesHoverBound = false;

// 🎬 фильмы (карусель)
export function renderMovies(movies) {
    moviesData = movies;
    currentIndex = 0;

    resetMoviesAutoplay();
    showMovie();
}

async function showMovie() {
    const container = document.getElementById('movies-list');
    bindMoviesHover(container);

    container.innerHTML = '';
    if (!moviesData || moviesData.length === 0) {
        clearAutoplay(moviesAutoplayId);
        moviesAutoplayId = null;
        container.innerHTML = '<p data-i18n="noMoviesFound"></p>';
        updateTexts();
        return;
    }

    const movie = moviesData[currentIndex];

    const details = await getMovieDetails(movie.id);

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : '';


    const director = details.credits?.crew?.find(p => p.job === 'Director');
    const actors = details.credits?.cast?.slice(0, 3).map(a => a.name).join(', ');
    const trailerUrl = getTrailerUrl(details.videos?.results);
    const card = document.createElement('div');
    card.classList.add('movie-card', 'fade-in');

    card.innerHTML = `
  <div class="movie-card__image">
    ${imageUrl ? `<img src="${imageUrl}" alt="${movie.title}" />` : ''}
  </div>

  <div class="movie-card__info">
    <h2 class="movie-card__title">${movie.title}</h2>

    <p class="movie-card__rating">⭐ ${movie.vote_average}</p>

    <p class="movie-card__description">
      ${movie.overview || translate('noDescription')}...
    </p>
   <p class="movie-card__meta">
      <span data-i18n="director"></span>: 🎬 ${director ? director.name : '—'}
   </p>

    <p class="movie-card__meta">
    <span data-i18n="cast"></span>: 🎭 ${actors || '—'}
    </p>

    <p class="movie-card__meta">
    <span data-i18n="release"></span>: 📅 ${movie.release_date || '—'}
    </p>
    <div class="movie-card__actions">
      <button class="btn btn-primary btn-trailer" data-i18n="trailer"></button>
    </div>
   <button class="btn-fav ${isFavorite(movie.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z" />
  </svg>
</button>
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
    updateTexts();
}

function clearAutoplay(timerId) {
    if (timerId) {
        clearInterval(timerId);
    }
}

function bindHoverAutoplay(container, onEnter, onLeave, isBound) {
    if (!container || isBound) {
        return isBound;
    }

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchstart', onEnter, { passive: true });
    container.addEventListener('touchend', onLeave, { passive: true });
    container.addEventListener('touchcancel', onLeave, { passive: true });

    return true;
}

function resetMoviesAutoplay() {
    clearAutoplay(moviesAutoplayId);

    if (moviesData.length <= 1 || isMoviesHovered) {
        moviesAutoplayId = null;
        return;
    }

    moviesAutoplayId = setInterval(() => {
        nextMovie(false);
    }, AUTOPLAY_DELAY);
}

function bindMoviesHover(container) {
    moviesHoverBound = bindHoverAutoplay(
        container,
        () => {
            isMoviesHovered = true;
            clearAutoplay(moviesAutoplayId);
            moviesAutoplayId = null;
        },
        () => {
            isMoviesHovered = false;
            resetMoviesAutoplay();
        },
        moviesHoverBound
    );
}

export function nextMovie(resetAutoplay = true) {
    if (!moviesData.length) {
        return;
    }

    currentIndex = (currentIndex + 1) % moviesData.length;

    if (resetAutoplay) {
        resetMoviesAutoplay();
    }

    showMovie();
}

export function prevMovie() {
    if (!moviesData.length) {
        return;
    }

    currentIndex = (currentIndex - 1 + moviesData.length) % moviesData.length;
    resetMoviesAutoplay();
    showMovie();
}
let currentSeriesIndex = 0;
let seriesData = [];
let seriesAutoplayId = null;
let isSeriesHovered = false;
let seriesHoverBound = false;

export function renderSeries(series) {
    seriesData = series;
    currentSeriesIndex = 0;

    resetSeriesAutoplay();
    showSeries();
}

async function showSeries() {
    const container = document.getElementById('series-list');
    bindSeriesHover(container);
    container.innerHTML = '';
    if (!seriesData || seriesData.length === 0) {
        clearAutoplay(seriesAutoplayId);
        seriesAutoplayId = null;
        container.innerHTML = '<p data-i18n="noSeriesFound"></p>';
        updateTexts();
        return;
    }


    const show = seriesData[currentSeriesIndex];

    const details = await getSeriesDetails(show.id);

    const actors = details.aggregate_credits?.cast?.slice(0, 3).map(a => a.name).join(', ');
    const creator = details.created_by?.[0]?.name;
    const years = details.first_air_date?.split('-')[0];
    const seasons = details.number_of_seasons;
    const trailerUrl = getTrailerUrl(details.videos?.results);

    const imageUrl = show.poster_path
        ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
        : '';

    const card = document.createElement('div');
    card.classList.add('series-card');

    card.innerHTML = `
    <div class="series-card__image">
    ${imageUrl ? `<img src="${imageUrl}" alt="${show.name}" />` : ''}
  </div> 
  <div class="series-card__info">
    <h2>${show.name}</h2>
    
    <p>⭐ ${show.vote_average}</p>
    <p>${show.overview || translate('noDescription')}</p>
    <p class = serials-card_meta>
    <span data-i18n="creator"></span>: 🎬 ${creator || '—'} 
    </p>
    <p class = serials-card_meta>
    🎭 ${actors || '—'}
    </p>
    <p class = serials-card_meta>
    📅 ${years || '—'}
    </p>
    <p class = serials-card_meta>
    ${seasons} <span data-i18n="seasonsLabel"></span>
    </p>
    <div class="series-card__actions">
      <button class="btn btn-primary btn-trailer" data-i18n="trailer"></button>
    </div>
    <button class="btn-fav ${isFavorite(show.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
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
    updateTexts();
}

function setupTrailerButton(button, trailerUrl) {
    if (!button) {
        return;
    }

    if (!trailerUrl) {
        button.remove();
        return;
    }

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(trailerUrl, '_blank', 'noopener,noreferrer');
    });
}

function resetSeriesAutoplay() {
    clearAutoplay(seriesAutoplayId);

    if (seriesData.length <= 1 || isSeriesHovered) {
        seriesAutoplayId = null;
        return;
    }

    seriesAutoplayId = setInterval(() => {
        nextSeries(false);
    }, AUTOPLAY_DELAY);
}

function bindSeriesHover(container) {
    seriesHoverBound = bindHoverAutoplay(
        container,
        () => {
            isSeriesHovered = true;
            clearAutoplay(seriesAutoplayId);
            seriesAutoplayId = null;
        },
        () => {
            isSeriesHovered = false;
            resetSeriesAutoplay();
        },
        seriesHoverBound
    );
}

export function nextSeries(resetAutoplay = true) {
    if (!seriesData.length) {
        return;
    }

    currentSeriesIndex = (currentSeriesIndex + 1) % seriesData.length;

    if (resetAutoplay) {
        resetSeriesAutoplay();
    }

    showSeries();
}

export function prevSeries() {
    if (!seriesData.length) {
        return;
    }

    currentSeriesIndex = (currentSeriesIndex - 1 + seriesData.length) % seriesData.length;
    resetSeriesAutoplay();
    showSeries();
}

export function renderMusic(tracks) {
    const container = document.getElementById('music-list');
    container.innerHTML = '';

    tracks.forEach(track => {
        const image = track.image;

        const isPlaceholder = (url) =>
            !url || url.includes('2a96cbd8b46e442fc41c2b86b821562f');

        const imageUrl = !isPlaceholder(image)
            ? image
            : null;

        const card = document.createElement('div');
        card.classList.add('music-card', 'fade-in');

        card.innerHTML = `
            <div class="music-card__image">
                ${imageUrl
                ? `<img src="${imageUrl}" alt="${track.name}" />`
                : `<div class="music-card__placeholder">🎵</div>`
            }
            </div>

            <div class="music-card__info">
                <p class="music-card__title">${track.name}</p>
                <p class="music-card__artist">${track.artist.name}</p>

                <a href="${track.url}" target="_blank" class="music-card__btn" data-i18n="listen">
                </a>
                <button class="btn-fav ${isFavorite(track.url) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
            </div>
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

    updateTexts();
}

export function renderBooks(books) {
    const container = document.getElementById('books-list');
    container.innerHTML = '';

    books.forEach(book => {
        const info = book.volumeInfo;

        const title = info.title;
        const authors = info.authors?.join(', ') || translate('unknownAuthor');
        const link = info.previewLink;
        const image = info.imageLinks?.thumbnail;

        const card = document.createElement('div');
        card.classList.add('book-card', 'fade-in');

        card.innerHTML = `
            <div class="book-card__image">
                ${image
                ? `<img src="${image}" alt="${title}" />`
                : `<div class="book-card__placeholder">📚</div>`
            }
            </div>

            <div class="book-card__info">
                <p class="book-card__title">${title}</p>
                <p class="book-card__author">${authors}</p>

                <a href="${link}" target="_blank" class="book-card__btn" data-i18n="preview">
                </a>
                <button class="btn-fav ${isFavorite(book.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
            </div>
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

    updateTexts();
}
export function showLoading() {
    document.querySelector('.loader')?.classList.remove('hidden');
}

export function hideLoading() {
    document.querySelector('.loader')?.classList.add('hidden');
}

export function showError(key, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
        <p class="error" data-i18n="${key}"></p>
    `;

    updateTexts();
}

export function renderMoviesSkeleton() {
    const container = document.getElementById('movies-list');

    container.innerHTML = `
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    `;
}
export function renderSeriesSkeleton() {
    const container = document.getElementById('series-list');

    container.innerHTML = `
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    `;
}

export function renderBooksSkeleton() {
    const container = document.getElementById('books-list');

    container.innerHTML = `
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
    `;
}

export function renderMusicSkeleton() {
    const container = document.getElementById('music-list');

    container.innerHTML = `
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
    `;
}



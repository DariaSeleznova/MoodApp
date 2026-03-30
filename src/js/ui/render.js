let currentIndex = 0;
let moviesData = [];

// 🎬 фильмы (карусель)
export function renderMovies(movies) {
    moviesData = movies;
    currentIndex = 0;

    showMovie();
}

function showMovie() {
    const container = document.getElementById('movies-list');
    container.innerHTML = '';
    if (!moviesData || moviesData.length === 0) {
        container.innerHTML = '<p>No movies found</p>';
        return;
    }


    const movie = moviesData[currentIndex];

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : '';

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
      ${movie.overview?.slice(0, 120) || 'No description available'}...
    </p>

    <div class="movie-card__actions">
      <button class="btn-trailer">▶ Trailer</button>
    </div>
  </div>
`;

    container.appendChild(card);
}

export function nextMovie() {
    if (currentIndex < moviesData.length - 1) {
        currentIndex++;
        showMovie();
    }
}

export function prevMovie() {
    if (currentIndex > 0) {
        currentIndex--;
        showMovie();
    }
}
let currentSeriesIndex = 0;
let seriesData = [];

export function renderSeries(series) {
    seriesData = series;
    currentSeriesIndex = 0;

    showSeries();
}

function showSeries() {
    const container = document.getElementById('series-list');
    container.innerHTML = '';
    if (!seriesData || seriesData.length === 0) {
        container.innerHTML = '<p>No series found</p>';
        return;
    }


    const show = seriesData[currentSeriesIndex];

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
    <p>${show.overview?.slice(0, 120) || 'No description available'}...</p>
    <div class="series-card__actions">
      <button class="btn-trailer">▶ Trailer</button>
    </div>
  </div>
`;

    container.appendChild(card);
}
export function nextSeries() {
    if (currentSeriesIndex < seriesData.length - 1) {
        currentSeriesIndex++;
        showSeries();
    }
}

export function prevSeries() {
    if (currentSeriesIndex > 0) {
        currentSeriesIndex--;
        showSeries();
    }
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

                <a href="${track.url}" target="_blank" class="music-card__btn">
                    ▶ Listen
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}

export function renderBooks(books) {
    const container = document.getElementById('books-list');
    container.innerHTML = '';

    books.forEach(book => {
        const info = book.volumeInfo;

        const title = info.title;
        const authors = info.authors?.join(', ') || 'Unknown author';
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

                <a href="${link}" target="_blank" class="book-card__btn">
                    📖 Preview
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}
export function showLoading() {
    document.querySelector('.loader')?.classList.remove('hidden');
}

export function hideLoading() {
    document.querySelector('.loader')?.classList.add('hidden');
}

export function showError(message) {
    const el = document.querySelector('.error');
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
    }
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
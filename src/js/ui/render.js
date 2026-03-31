import { toggleFavorite, isFavorite } from '../services/favoritesService';

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
      ${movie.overview || 'No description available'}...
    </p>

    <div class="movie-card__actions">
      <button class="btn-trailer">▶ Trailer</button>
    </div>
   <button class="btn-fav ${isFavorite(movie.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z" />
  </svg>
</button>
  </div>
`;
    const favBtn = card.querySelector('.btn-fav');

    favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы не триггерить клик по карточке

        toggleFavorite({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path,
            type: 'movie',
            rating: movie.vote_average
        });

        favBtn.classList.toggle('active');
    });

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
    <button class="btn-fav ${isFavorite(show.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
  </div>
`;
    const favBtn = card.querySelector('.btn-fav');

    favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы не триггерить клик по карточке

        toggleFavorite({
            id: show.id,
            title: show.name,
            image: show.poster_path,
            type: 'series',
            rating: show.vote_average
        });

        favBtn.classList.toggle('active');
    });

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
                <button class="btn-fav ${isFavorite(track.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
            </div>
        `;
        const favBtn = card.querySelector('.btn-fav');

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // чтобы не триггерить клик по карточке

            toggleFavorite({
                id: track.url, // 🔥 уникальный id (важно!)
                title: track.name,
                image: track.image,
                type: 'music',
                link: track.url
            });
            favBtn.classList.toggle('active');
        });

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
                <button class="btn-fav ${isFavorite(book.id) ? 'active' : ''}">
  <svg class="heart" viewBox="0 0 32 32">
    <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
  </svg>
</button>
            </div>
        `;
        const favBtn = card.querySelector('.btn-fav');

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // чтобы не триггерить клик по карточке

            toggleFavorite({
                id: book.id,
                title: info.title,
                image: info.imageLinks?.thumbnail,
                type: 'book',
                link: info.previewLink
            });

            favBtn.classList.toggle('active');
        });
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
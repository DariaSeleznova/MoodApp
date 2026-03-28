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

    const movie = moviesData[currentIndex];

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : '';

    const card = document.createElement('div');

    card.innerHTML = `
    <h2>${movie.title}</h2>
    ${imageUrl ? `<img src="${imageUrl}" />` : ''}
    <p>⭐ ${movie.vote_average}</p>
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

    const show = seriesData[currentSeriesIndex];

    const imageUrl = show.poster_path
        ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
        : '';

    const card = document.createElement('div');
    card.classList.add('series-card');

    card.innerHTML = `
    <h2>${show.name}</h2>
    ${imageUrl ? `<img src="${imageUrl}" />` : ''}
    <p>⭐ ${show.vote_average}</p>
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
        const item = document.createElement('div');
        item.classList.add('music-item');

        item.innerHTML = `
      <p><strong>${track.name}</strong> — ${track.artist.name}</p>
      <a href="${track.url}" target="_blank">▶ Listen</a>
    `;

        container.appendChild(item);
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
        const image = info.imageLinks?.thumbnail || '';

        const item = document.createElement('div');
        item.classList.add('book-item');

        item.innerHTML = `
      <p><strong>${title}</strong></p>
      <p>${authors}</p>
      ${image ? `<img src="${image}" />` : ''}
      <a href="${link}" target="_blank">📖 Preview</a>
    `;

        container.appendChild(item);
    });
}
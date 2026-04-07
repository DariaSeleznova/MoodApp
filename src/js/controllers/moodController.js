import { getMoviesByMood, getTrendingMovies } from '../services/movieService';
import { getSeriesByMood, getTrendingSeries } from '../services/movieService';
import { getMusicByMood, getTrendingMusic } from '../services/musicService';
import { getBooksByMood, getTrendingBooks } from '../services/bookService';
import * as renderer from '../ui/render';
import { hideBooksLoading, hideMoviesLoading, hideMusicLoading, hideSeriesLoading } from '../ui/events';

let moviesRequestId = 0;
let seriesRequestId = 0;
let booksRequestId = 0;
let musicRequestId = 0;

export async function loadTrendingContent() {
    loadTrendingMovies();
    loadTrendingSeries();
    loadTrendingMusic();
    loadTrendingBooks();
}
export async function loadTrendingMovies() {
    try {
        renderer.renderMoviesSkeleton();

        const movies = await getTrendingMovies(10);

        renderer.renderMovies(movies);

    } catch (e) {
        renderer.showError('moviesError', 'movies-list');
    }
}
export async function loadTrendingSeries() {
    try {
        renderer.renderSeriesSkeleton();

        const series = await getTrendingSeries(10);

        renderer.renderSeries(series);

    } catch (e) {
        renderer.showError('seriesError', 'series-list');
    }
}
export async function loadTrendingBooks() {
    try {
        renderer.renderBooksSkeleton();

        const books = await getTrendingBooks(3);

        renderer.renderBooks(books);

    } catch (e) {
        renderer.showError('booksError', 'books-list');
    }
}

export async function loadTrendingMusic() {
    try {
        renderer.renderMusicSkeleton();

        const music = await getTrendingMusic(5);

        renderer.renderMusic(music);

    } catch (e) {
        renderer.showError('musicError', 'music-list');
    }
}

export async function getContentByMood(mood) {
    const movies = await getMoviesByMood(mood);
    const series = await getSeriesByMood(mood);
    const music = await getMusicByMood(mood);
    const books = await getBooksByMood(mood);

    return {
        movies,
        series,
        books,
        music
    };
}

export async function loadMovies(mood) {
    try {
        renderMoviesSkeleton();
        const requestId = ++moviesRequestId;

        const movies = await getMoviesByMood(mood, 10);
        if (requestId !== moviesRequestId) return;

        renderer.renderMovies(movies);

    } catch (e) {
        renderer.showError('moviesError', 'movies-list');
    } finally {
        hideMoviesLoading();
    }
}

export async function loadSeries(mood) {
    try {
        renderSeriesSkeleton();
        const requestId = ++seriesRequestId;

        const series = await getSeriesByMood(mood, 10);
        if (requestId !== seriesRequestId) return;

        renderer.renderSeries(series);
    } catch (e) {
        renderer.showError('seriesError', 'series-list');
    }
    finally {
        hideSeriesLoading();
    }
}

export async function loadBooks(mood) {
    try {
        renderBooksSkeleton();
        const requestId = ++booksRequestId;

        const books = await getBooksByMood(mood, 3);
        if (requestId !== booksRequestId) return;

        renderer.renderBooks(books);
    } catch (e) {
        renderer.showError('booksError', 'books-list');
    }
    finally {
        hideBooksLoading();
    }
}

export async function loadMusic(mood) {
    try {
        renderMusicSkeleton();
        const requestId = ++musicRequestId;

        const music = await getMusicByMood(mood, 5);
        if (requestId !== musicRequestId) return;

        renderer.renderMusic(music);
    } catch (e) {
        renderer.showError('musicError', 'music-list');
    }
    finally {
        hideMusicLoading();
    }
}

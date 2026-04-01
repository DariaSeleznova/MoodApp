import { getMoviesByMood, getTrendingMovies } from '../services/movieService';
import { getSeriesByMood, getTrendingSeries } from '../services/movieService';
import { getMusicByMood, getTrendingMusic } from '../services/musicService';
import { getBooksByMood, getTrendingBooks } from '../services/bookService';
import { renderMoviesSkeleton, renderSeriesSkeleton, renderBooksSkeleton, renderMusicSkeleton } from '../ui/render';
import * as renderer from '../ui/render';
import { hideBooksLoading, hideMoviesLoading, hideMusicLoading, hideSeriesLoading } from '../ui/events';

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
        renderer.showError('Ошибка фильмов');
    }
}
export async function loadTrendingSeries() {
    try {
        renderer.renderSeriesSkeleton();

        const series = await getTrendingSeries();

        renderer.renderSeries(series);

    } catch (e) {
        renderer.showError('Ошибка сериалов');
    }
}
export async function loadTrendingBooks() {
    try {
        renderer.renderBooksSkeleton();

        const books = await getTrendingBooks(3);

        renderer.renderBooks(books);

    } catch (e) {
        renderer.showError('Ошибка книг');
    }
}

export async function loadTrendingMusic() {
    try {
        renderer.renderMusicSkeleton();

        const music = await getTrendingMusic(5);

        renderer.renderMusic(music);

    } catch (e) {
        renderer.showError('Ошибка музыки');
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
        const movies = await getMoviesByMood(mood);

        renderer.renderMovies(movies);

    } catch (e) {
        renderer.showError('Ошибка фильмов');
    } finally {
        hideMoviesLoading();
    }
}

export async function loadSeries(mood) {
    try {
        renderSeriesSkeleton();

        const series = await getSeriesByMood(mood);
        renderer.renderSeries(series);
    } catch (e) {
        renderer.showError('Ошибка сериалов');
    }
    finally {
        hideSeriesLoading();
    }
}

export async function loadBooks(mood) {
    try {
        renderBooksSkeleton();

        const books = await getBooksByMood(mood);
        renderer.renderBooks(books);
    } catch (e) {
        renderer.showError('Ошибка книг');
    }
    finally {
        hideBooksLoading();
    }
}

export async function loadMusic(mood) {
    try {
        renderMusicSkeleton();

        const music = await getMusicByMood(mood);
        renderer.renderMusic(music);
    } catch (e) {
        renderer.showError('Ошибка музыки');
    }
    finally {
        hideMusicLoading();
    }
}

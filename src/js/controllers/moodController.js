import { getMoviesByMood } from '../services/movieService';
import { getSeriesByMood } from '../services/movieService';
import { getMusicByMood } from '../services/musicService';
import { getBooksByMood } from '../services/bookService';
import { renderMoviesSkeleton, renderSeriesSkeleton, renderBooksSkeleton, renderMusicSkeleton } from '../ui/render';

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

import * as renderer from '../ui/render';
import { hideBooksLoading, hideMoviesLoading, hideMusicLoading, hideSeriesLoading } from '../ui/events';

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
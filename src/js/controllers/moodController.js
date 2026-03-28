import { getMoviesByMood } from '../services/movieService';
import { getSeriesByMood } from '../services/movieService';
import { getMusicByMood } from '../services/musicService';
import { getBooksByMood } from '../services/bookService';

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
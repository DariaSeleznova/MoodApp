
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getTrendingMovies() {
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, 10);
}

export async function getMoviesByMood(mood) {
    const genreMap = {
        happy: 35,       // комедия
        sad: 18,         // драма
        excited: 28,     // экшен
        relaxed: 10749,  // романтика
        scared: 27       // ужасы
    };

    const genreId = genreMap[mood] || 35;

    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.results.slice(0, 10);
}

export async function getTrendingSeries() {
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, 10);
}

export async function getSeriesByMood(mood) {
    const genreMap = {
        happy: 35,
        sad: 18,
        excited: 10759,
        relaxed: 10749,
        scared: 9648
    };

    const genreId = genreMap[mood] || 35;

    const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=en-US`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch series');
    }

    const data = await response.json();

    return data.results.slice(0, 10);
}
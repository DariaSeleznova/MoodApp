const API_KEY = process.env.TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getMoviesByMood(mood) {
    const genreMap = {
        happy: 35,       // комедия
        sad: 18,         // драма
        excited: 28,     // экшен
        relaxed: 10749,  // романтика
        scared: 27       // ужасы
    };

    const genreId = genreMap[mood] || 35;

    const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&language=en-US`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    const data = await response.json();

    return data.results.slice(0, 5);
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

    const url = `${BASE_URL}/discover/tv?with_genres=${genreId}&language=en-US`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    });

    const data = await response.json();

    return data.results.slice(0, 5);
}
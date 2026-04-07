import { getApiLanguage } from '../i18n/i18n';
const API_KEY = process.env.TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const movieDetailsCache = new Map();
const seriesDetailsCache = new Map();


export async function getTrendingMovies(limit = 20) {
    const language = getApiLanguage();
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${language}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, limit);
}

export async function getMoviesByMood(mood, limit = 20) {
    const language = getApiLanguage();
    const genreMap = {
        happy: [35, 10749, 28, 12, 14],
        sad: [18, 36, 10402, 53],
        excited: [28, 12, 14],
        relaxed: [10749, 35, 99],
        scared: [27, 80, 9648],
        tired: [53, 10751, 14, 18],
        spirited: [28, 12, 14],
    };
    function getRandomGenres(mood) {
        const genres = genreMap[mood] || [35];

        const shuffled = genres.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2).join(',');
    }

    const genreId = getRandomGenres(mood);

    const url = `${BASE_URL}/discover/movie?api_key=${process.env.TMDB_TOKEN}&with_genres=${genreId}&language=${language}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.results.slice(0, limit);
}

export async function getTrendingSeries(limit = 20) {
    const language = getApiLanguage();
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=${language}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, limit);
}

export async function getSeriesByMood(mood, limit = 20) {
    const language = getApiLanguage();
    const genreMap = {
        happy: [35],
        sad: [18],
        excited: [10768],
        relaxed: [10749],
        scared: [9648],
        tired: [10765],
        spirited: [10759],
    };

    const genreId = genreMap[mood] || 35;

    const url = `${BASE_URL}/discover/tv?api_key=${process.env.TMDB_TOKEN}&with_genres=${genreId}&language=${language}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch series');
    }

    const data = await response.json();

    return data.results.slice(0, limit);
}
export async function getMovieGenres() {
    const language = getApiLanguage();
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.genres;
}

async function fetchTmdbDetails(url, cache, cacheKey, errorMessage) {
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    const data = await response.json();
    cache.set(cacheKey, data);

    return data;
}

export async function getMovieDetails(movieId) {
    const language = getApiLanguage();
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}&append_to_response=credits,videos`;
    const cacheKey = `${movieId}-${language}`;

    return fetchTmdbDetails(url, movieDetailsCache, cacheKey, 'Failed to fetch movie details');
}

export async function getSeriesDetails(seriesId) {
    const language = getApiLanguage();
    const url = `${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&language=${language}&append_to_response=videos,aggregate_credits`;
    const cacheKey = `${seriesId}-${language}`;

    return fetchTmdbDetails(url, seriesDetailsCache, cacheKey, 'Failed to fetch series details');
}

export function getTrailerUrl(videos = []) {
    if (!Array.isArray(videos)) {
        return null;
    }

    const preferredTrailer = videos.find(video =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        video.official
    );

    const fallbackTrailer = videos.find(video =>
        video.site === 'YouTube' &&
        (video.type === 'Trailer' || video.type === 'Teaser')
    );

    const trailer = preferredTrailer || fallbackTrailer;

    return trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}


const API_KEY = process.env.TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getTrendingMovies(limit = 10) {
    const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, limit);
}

export async function getMoviesByMood(mood, limit = 10) {
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

    const url = `${BASE_URL}/discover/movie?api_key=${process.env.TMDB_TOKEN}&with_genres=${genreId}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.results.slice(0, limit);
}

export async function getTrendingSeries() {
    const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, 10);
}

export async function getSeriesByMood(mood, limit = 10) {
    const genreMap = {
        happy: [35],
        sad: [18],
        excited: [10768],
        relaxed: [10749],
        scared: [9648],
        tired: [10765],
        spirited: [10759],
    };
    // {
    //   10759: "Action & Adventure",
    //   16: "Animation",
    //   35: "Comedy",
    //   18: "Drama",
    //   10765: "Sci-Fi & Fantasy",
    //   9648: "Mystery",
    //   10768: "War & Politics",
    //   37: "Western"
    // }
    const genreId = genreMap[mood] || 35;
    console.log('Series Mood:', mood, 'Genre ID:', genreId);

    const url = `${BASE_URL}/discover/tv?api_key=${process.env.TMDB_TOKEN}&with_genres=${genreId}&language=en-US`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch series');
    }

    const data = await response.json();

    return data.results.slice(0, limit);
}
export async function getMovieGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ru-RU`;

    const res = await fetch(url);
    const data = await res.json();

    return data.genres;
}

// Call and log the data
getMovieGenres().then(genres => {
    console.log('Movie Genres:', genres);
}).catch(error => {
    console.error('Error fetching genres:', error);
});
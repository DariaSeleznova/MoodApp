const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmJmMjk1YjRhYzMzNjYxMThjZDdkMTVjZjI4MWI1OCIsIm5iZiI6MTc3NDUzNTM5Ny40NDUsInN1YiI6IjY5YzU0MmU1NGNjNDU2ZTc4NjQyMGI2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4nI69jLzwrJslMbhRVB_V8bMf8q6h-EaJ3mVxA1YrK4';
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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmJmMjk1YjRhYzMzNjYxMThjZDdkMTVjZjI4MWI1OCIsIm5iZiI6MTc3NDUzNTM5Ny40NDUsInN1YiI6IjY5YzU0MmU1NGNjNDU2ZTc4NjQyMGI2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4nI69jLzwrJslMbhRVB_V8bMf8q6h-EaJ3mVxA1YrK4'
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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMmJmMjk1YjRhYzMzNjYxMThjZDdkMTVjZjI4MWI1OCIsIm5iZiI6MTc3NDUzNTM5Ny40NDUsInN1YiI6IjY5YzU0MmU1NGNjNDU2ZTc4NjQyMGI2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4nI69jLzwrJslMbhRVB_V8bMf8q6h-EaJ3mVxA1YrK4'
        }
    });

    const data = await response.json();

    return data.results.slice(0, 5);
}
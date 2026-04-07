import { getBooksLanguage } from "../i18n/i18n";

const API_KEY = process.env.GOOGLE_KEY;


export async function getBooksByMood(mood, limit) {
    const lang = getBooksLanguage();
    const queryMap = {
        happy: 'funny novels',
        sad: 'sad love story',
        relaxed: 'light romance books',
        excited: 'adventure books',
        tired: 'calm relaxing books',
        spirited: 'motivational books'
    };

    const query = queryMap[mood] || 'popular2026 books';


    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(query)}&langRestrict=${lang}&maxResults=${limit}&key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch books');
    }

    const data = await res.json();

    return data.items || [];
}

export async function getTrendingBooks(limit = 30) {
    const lang = getBooksLanguage();
    const query = 'trending books 2026';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&langRestrict=${lang}&maxResults=${limit}&key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch trending books');
    }

    const data = await res.json();

    return data.items || [];
}

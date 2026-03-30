const API_KEY = process.env.GOOGLE_KEY;

export async function getBooksByMood(mood) {
    const queryMap = {
        happy: 'funny novels',
        sad: 'sad love story',
        relaxed: 'light romance books',
        excited: 'adventure books',
        tired: 'calm relaxing books',
        spirited: 'motivational books'
    };

    const query = queryMap[mood] || 'popular books';

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3&key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch books');
    }

    const data = await res.json();

    return data.items || [];
}
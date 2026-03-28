const API_KEY = 'AIzaSyBZrlhy0xrXYF7eAilnKyeywFS_8KfgWrc';

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

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    return data.items || [];
}
export async function getBooksByMood(mood, limit = 12) {
    const subjectMap = {
        happy: 'humor',
        sad: 'romance',
        relaxed: 'fiction',
        excited: 'thriller',
        tired: 'short_stories',
        spirited: 'biography'
    };

    const subject = subjectMap[mood] || 'fiction';

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(subject)}&limit=${limit}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Failed to fetch books');
    }

    const data = await res.json();
    return (data.docs || []).map((book) => ({
        title: book.title,
        authors: (book.author_name || []).map((name) => ({ name })),
        key: book.key,
        cover_id: book.cover_i ?? null
    }));
}

export async function getTrendingBooks(limit = 30) {
    const url = `https://openlibrary.org/subjects/bestseller.json?limit=${limit}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error('Failed to fetch trending books');
    }

    const data = await res.json();

    return data.works || [];
}

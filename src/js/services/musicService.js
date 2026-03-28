const API_KEY = process.env.LASTFM_KEY;

export async function getMusicByMood(mood) {
    const tagMap = {
        happy: 'happy',
        sad: 'sad',
        relaxed: 'chill',
        excited: 'party',
        tired: 'calm',
        spirited: 'energetic'
    };

    const tag = tagMap[mood] || 'happy';

    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=${API_KEY}&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    return data.tracks.track.slice(0, 5);
}
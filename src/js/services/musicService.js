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
    if (!res.ok) {
        throw new Error('Failed to fetch music');
    }

    const data = await res.json();

    const tracks = data.tracks.track.slice(0, 5);

    const detailedTracks = await Promise.all(
        tracks.map(async (track) => {
            const details = await getTrackDetails(track);
            const image = details?.album?.image?.[2]?.['#text'];

            return {
                ...track,
                image: image && image.trim() !== ''
                    ? image
                    : track.image?.[2]?.['#text'] || ''
            };
        })
    );
    return detailedTracks;
}
export async function getTrackDetails(track) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    return data.track;
}
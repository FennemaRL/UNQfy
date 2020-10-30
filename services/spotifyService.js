const rp = require("request-promise");

class SpotifyService {
    async populateAlbumsForArtist(artist_name) {
        const options = await readfile("spotifyCreds.json")
            .then(JSON.parse)
            .then((cred) => cred.access_token)
            .then((token) => ({
                headers: { Authorization: `Bearer ${token}` },
                json: true,
            }));
        return rp
            .get(
                `https://api.spotify.com/v1/search?q=${artist_name}&type=artist&limit=1`,
                options
            )
            .then(({ artists }) =>
                artists.items[0] ? artists.items[0].id : undefined
            )
            .then((artistId) =>
                rp.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, options)
            )
            .then(({ items }) =>
                Promise.all(
                items.map((album) =>
                    rp.get(`https://api.spotify.com/v1/albums/${album.id}`, options)
                )
            )
        )}
}

module.exports = SpotifyService;
const rp = require("request-promise");

class MusixmatchService {
    getSongLyrics(artist, track) {
        const BASE_URL = "http://api.musixmatch.com/ws/1.1";
        var options = {
          uri: `${BASE_URL}/track.search`,
          qs: {
            apikey: process.env.MUSIXMATCH,
            q_artist: artist.name,
            q_track: track.name,
            page_size: 1,
          },
          json: true,
        };
    
        return rp
          .get(options)
          .then(({ message }) => message.body.track_list[0].track.track_id)
          .then((track_id) => {
            var options = {
              uri: `${BASE_URL}/track.lyrics.get`,
              qs: {
                apikey: process.env.MUSIXMATCH,
                track_id,
              },
              json: true,
            };
            return rp.get(options);
          })
    }
}

module.exports = MusixmatchService;
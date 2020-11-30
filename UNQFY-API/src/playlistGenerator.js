const Playlist = require('./playlist')

class PlaylistGenerator {
    generate(idPlaylist, namePlaylist, genresToInclude, maxDuration, artists) {
        let tracks = []
        Object.keys(artists).forEach(artistId => {
            let artist = artists[artistId]
            let artistTracks = artist.getTracksMatchingGenres(genresToInclude);
            tracks = tracks.concat(artistTracks)
        })
        let shuffledTracks = tracks.map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map(vs=> vs.value)

        let duration = 0;
        tracks =[]
        for (let index=0; index < shuffledTracks.length; index++) {
            if((duration + shuffledTracks[index].duration) <= maxDuration) {
                tracks.push(shuffledTracks[index])
                duration += (shuffledTracks[index]).duration
            }
        }   
    
        return new Playlist(idPlaylist, namePlaylist,genresToInclude, maxDuration, tracks); 
    }

}
module.exports = PlaylistGenerator;
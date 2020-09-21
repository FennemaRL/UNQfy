

class Playlist {
    constructor(id, name, genres, duration, tracks) {
        this._id = id
        this._name = name
        this._genres = genres
        this._max_duration = duration
        this._tracks = tracks
    }
    get tracks() {
        return this._tracks
    }
    hasTrack(track) {
        return this._tracks.some(t => t === track)
    }
    get name() {
        return this._name
    }
    get duration(){
        return this._max_duration
    }

    deleteTracks(tracks_to_delete) {
        tracks_to_delete.forEach(track_to_delete => {
            this._tracks = this._tracks.filter(track => (track.id != track_to_delete.id))
        })
    } 
}
module.exports = Playlist;
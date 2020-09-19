

class Playlist {
    constructor(name, genre, duration) {
        this._name = name
        this._genre = genre
        this._max_duration = duration
        this._tracks = this._track_list(genre, duration)
    }
    _track_list(genre, max_duration) {
        
    }
}
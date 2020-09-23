class Artist {
    constructor(id, name, country){
    this._id = id;
    this._name = name;
    this._country = country;
    this._albums = [];
    }
    
    get id(){ return this._id;}

    get name(){ return this._name;}
    
    get country(){ return this._country;}

    addAlbum(album) { 
        this._albums.push(album);
    }

    hasAlbumWithId(albumId) {
        return this._albums.some(album => album.sameKey(albumId))
    }
    hasTrackWithId(trackId) {
        return this._albums.some(album => album.hasTrackWithId(trackId))
    }

    addSongToAlbum(albumId, track) {
        const album = this._albums.find( album => album.sameKey(albumId))

        //if(!album) //err no hay album

        album.addTrack(track)
    }
    searchAlbumByName(content) {
        return this._albums.filter(album => album.name.includes(content))
    }
    searchTrackByName(content){
        return this._albums.reduce((track_list, album) => track_list.concat(album.searchTrackByName(content)),[])
    }
    getTracksMatchingGenres(genres){
        return this._albums.reduce((track_list, album) => track_list.concat(album.getTracksMatchingGenres(genres)),[])
    }
    getTracksMatchingArtist(artistName){
        if(this._name != artistName) {
            return []
        }
        return this._albums.reduce((tracks,album) => { 
            return tracks.concat(album.tracks)},[]);
    }

    getAllAlbums() {
        return this._albums
    }
    getAllTracks() {
        let tracks = []
        this._albums.forEach(album => tracks = tracks.concat(album.tracks))
        return tracks
    }

    getAlbumById(id) {
        return this._albums.find(album => (album.id === id))
    }
    getTrackById(id) {
        let track_owner = this._albums.find(album => (album.hasTrackWithId(id)))
        return track_owner.getTrackById(id)
    }

    deleteAlbum(albumID) {
        let album_to_delete = this._albums.find(album => (album.id === albumID))
        this._albums = this._albums.filter(album => (album.id != albumID))
        return album_to_delete
    }
    deleteTrack(trackID) {
        let track_owner = this._albums.find(album => (album.hasTrackWithId(trackID)))
        return track_owner.deleteTrack(trackID)
    }
}
module.exports = Artist;
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const PlaylistGenerator = require('./playlistGenerator')
class Service {

    constructor(){
        this._artists = new Map;
        this._playlists = new Map;
        this._playlistGenerator = new PlaylistGenerator();
    }

    addArtist(artistData, keyGen) {
        const id = keyGen.getKeyArtist();
        const newArtist = new Artist(id, artistData.name, artistData.country);
        this._artists.set(id,newArtist);
        return newArtist;
    }
    
    addAlbum(artistId, albumData, keyGen) {
        const id = keyGen.getKeyAlbum();
        const newAlbum = new Album(id, artistId, albumData.name, albumData.year);
        const artistFind = this._artists.get(artistId);
        if(!artistId) { // artista no existe
        }
        artistFind.addAlbum(newAlbum);
        return newAlbum;
    }

    addTrack(albumId, trackData, keyGen) {
        const id = keyGen.getKeyTrack();
        let albumOwner;
        this._artists.forEach(artist => {
            if(artist && artist.hasAlbumWidthId(albumId)){albumOwner= artist;
            }})
       // if(!albumOwner) //tirar ex
        
        const createdTrack = new Track(id, albumId, trackData.name, trackData.duration, trackData.genres);
        albumOwner.addSongToAlbum(albumId, createdTrack)
        return createdTrack;
    }

    generatePlayList(name, genresToInclude, maxDuration,keyGen) {
        // falta recolector de tracks, playlist.js y playlistGenerator.js

        const id = keyGen.getKeyPlayList();
        let playlist = this._playlistGenerator.generate(id,name,genresToInclude, maxDuration, this._artists)
        this._playlists.set(id,playlist)
        return playlist
    }

    searchByName(content) {
        let res = {
            artists: this.searchArtistByName(content), 
            albums: this.searchAlbumByName(content), 
            tracks: this.searchTrackByName(content),
            playlists: this.searchPlaylistByName(content)
        }
        console.log(res)

        return res;
    }
    searchArtistByName(content) {
        let artist_with_name = []
        this._artists.forEach(artist => artist.name.includes(content)?artist_with_name.push(artist):undefined)
        return artist_with_name
    }
    searchAlbumByName(content) {
        let album_with_name = []
        this._artists.forEach(artist => album_with_name = album_with_name.concat(artist.searchAlbumByName(content)))
        return album_with_name
    }
    searchTrackByName(content) {
        let track_with_name = []
        this._artists.forEach(artist => {track_with_name = track_with_name.concat(artist.searchTrackByName(content));})
        return track_with_name
    }
    searchPlaylistByName(content) { //falta generar playlist.js y logica
        const playlist_with_name = []
        this._playlists.forEach(playlist => {playlist.name.includes(content)?playlist_with_name.push(playlist):undefined})
        return playlist_with_name
    }

    getTracksMatchingGenres(genres) {
        let tracks = []
        this._artists.forEach(artist => tracks = tracks.concat(artist.getTracksMatchingGenres(genres)));
        return tracks
    }
    getTracksMatchingArtist(artistName) {
        let tracks = []
        this._artists.forEach(artist => tracks = tracks.concat(artist.getTracksMatchingArtist(artistName)));
        return tracks
    }

    getAllArtists() {
        this._artists.forEach(artist => console.log(artist))
        return this._artists
    }
    getAllAlbums() {
        let albums = []
        this._artist.forEach(artist => albums.concat(artist.getAllAlbums()))
        albums.forEach(album => console.log(album))
        return albums
    }
    getAllTracks() {
        let tracks = []
        this._artist.forEach(artist => tracks.concat(artist.getAllTracks()))
        tracks.forEach(track => console.log(track))
        return tracks
    }
    getAllPlaylists() {
        this._playlists.forEach(playlist => console.log(playlist))
        return this._playlists
    }
}
module.exports = Service;
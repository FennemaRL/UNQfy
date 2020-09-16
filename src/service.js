const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
class Service {

    constructor(){
        this._artists = new Map;
        this._playlist = new Map;
        //falta this._playlistGenerator
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
        for (let idArtist of this._artists.keys()) {
            let artist = this._artists.get(idArtist);
            if(artist && artist.hasAlbumWidthId(albumId)){
                albumOwner= artist;
            }
        }
       // if(!albumOwner) //tirar ex
        
        const createdTrack = new Track(id, albumId, trackData.name, trackData.duration, trackData.genres);
        albumOwner.addSongToAlbum(albumId, createdTrack)
        return createdTrack;
    }

    createPlaylist(name, genresToInclude, maxDuration) {
        // falta recolector de tracks, playlist.js y playlistGenerator.js
        this._playlist.push(this._playlistGenerator.generate(name, genresToInclude, maxDuration))
    }

    searchByName(content) {

    }
    searchArtistByName(content) {
        const artist_with_name = []
        for (let artistID in this._artists.values) {
            let artist = this._artists.get(artistID)
            if (artist.name.contains(content)) {
                artist_with_name.push(artist)
            }
        }
        return artist_with_name
    }
    searchAlbumByName(content) {
        const album_with_name = []
        for (let artistID in this._artists.values) {
            let artist = this._artists.get(artistID)
            album_with_name.push(artist.searchAlbumByName(content)) //falta lógica dentro de album
        }
        return album_with_name
    }
    searchTrackByName(content) {
        const track_with_name = []
        for (let artistID in this._artists.values) {
            let artist = this._artists.get(artistID)
            track_with_name.push(artist.searchTrackByName(content)) //falta lógica dentro de album y track
        }
        return track_with_name
    }
    searchPlaylistByName(content) { //falta generar playlist.js y logica
        const playlist_with_name = []
        for (let playlistID in this._playlist.values) {
            let playlist = this._playlist.get(playlistID)
            if (playlist.name.contains(content)) {
                playlist_with_name.push(artist)
            }
        }
        return playlist_with_name
    }
}
module.exports = Service;
const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
class Service {

    constructor(){
        this._artists = new Map;
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

}
module.exports = Service;
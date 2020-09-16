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

    hasAlbumWidthId(albumId) {
        return this._albums.some(album => album.sameKey(albumId))
    }
    addSongToAlbum(albumId, track) {
        const album = this._albums.find( album => album.sameKey(albumId))

        if(!album) //err

        album.addTrack(track)
    }
}


module.exports = Artist;
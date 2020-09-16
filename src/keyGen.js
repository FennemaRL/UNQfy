class KeyGen {

    constructor(){
        this._idArtist = 0;
        this._idAlbum = 0;
        this._idTrack = 0;
    }

    getKeyArtist(){
        const id = this._idArtist;
        this._idArtist++;
        return id;
    }

    getKeyAlbum(){
        const id = this._idAlbum;
        this._idAlbum++;
        return id;
    }
    getKeyTrack(){
        const id = this._idTrack;
        this._idTrack++;
        return id;
    }

}
module.exports = KeyGen;
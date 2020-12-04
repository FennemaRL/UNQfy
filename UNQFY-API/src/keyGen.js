class KeyGen {

    constructor(){
        this._idArtist = 1;
        this._idAlbum = 1;
        this._idTrack = 1;
        this._idPlaylist = 1;
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
    getKeyPlayList(){
        const id = this._idPlaylist;
        this._idPlaylist++;
        return id;

    }

}
module.exports = KeyGen;
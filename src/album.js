class Album {
    constructor(id,artistId, name, year){
    this._name = name;
    this._year = year;
    this._id = id;
    this._artistId = artistId;
    this._tracks = [];
    }

    get id(){ return this._id;}
    
    get name(){ return this._name;}
    
    get year(){ return this._year;}

    addTrack(track){
        this._tracks.push(track);
    }
    
    sameKey(albumid) {
        return this._id === albumid
    }
}


module.exports = Album;
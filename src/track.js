class Track {
    constructor(id, albumId, name, duration, genres){
        this._name = name;
        this._albumId = albumId;
        this._duration = duration;
        this._genres = genres;
        this._id = id;
    }
    
    get name(){ return this._name;}
    
    get duration(){ return this._duration;}

    get genres(){ return this._genres;}
    
    get id(){ return this._id;} 
}


module.exports = Track;
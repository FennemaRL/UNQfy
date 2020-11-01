class Album {
  constructor(id, artistId, name, year) {
    this._name = name;
    this._year = year;
    this._id = id;
    this._artistId = artistId;
    this._tracks = [];
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get year() {
    return this._year;
  }

  updateYear(year) {
    this._year = year;
  }

  addTrack(track) {
    if (this._tracks.some((album_track) => album_track.name === track.name)) {
      throw new Error(
        `Track with name "${track.name}" already exists in album with name "${this._name}"`
      );
    }
    this._tracks.push(track);
  }

  sameKey(albumid) {
    return this.id === albumid;
  }

  searchTrackByName(content) {
    return this._tracks.filter((track) => track.name.includes(content));
  }

  hasTrackWithId(trackId) {
    return this._tracks.some((track) => track.id === trackId);
  }

  getTracksMatchingGenres(genres) {
    return this._tracks.filter((track) =>
      track._genres.some((gen) => genres.includes(gen))
    );
  }
  get tracks() {
    return this._tracks;
  }
  getTrackById(id) {
    return this._tracks.find((track) => track.id === id);
  }

  deleteTrack(trackID) {
    let track_to_delete = this._tracks.find((track) => track.id === trackID);
    this._tracks = this._tracks.filter((track) => track.id != trackID);
    return [track_to_delete];
  }

  toJSON() {
    return {
      id: this._id,
      year: this._year,
      name: this._name,
      country: this._country,
      tracks: this._tracks,
    };
  }
}

module.exports = Album;

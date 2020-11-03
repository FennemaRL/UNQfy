const picklify = require("picklify"); // para cargar/guarfar unqfy
const fs = require("fs"); // para cargar/guarfar unqfy
const Service = require("./src/service");
const KeyGen = require("./src/keyGen");
const Artist = require("./src/artist");
const Playlist = require("./src/playlist");
const Album = require("./src/album");
const Track = require("./src/track");
const PlaylistGenerator = require("./src/playlistGenerator");

const rp = require("request-promise");
const util = require("util");
const SpotifyService = require("./services/spotifyService");
const MusixmatchService = require("./services/musixmatchService");

class UNQfy {
  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  constructor() {
    this._service = new Service();
    this._keyGen = new KeyGen();
    this._musixmatchService = new MusixmatchService();
  }

  addArtist(artistData) {
    /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
    return this._service.addArtist(artistData, this._keyGen);
  }

  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
    /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
    return this._service.addAlbum(artistId, albumData, this._keyGen);
  }

  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
    /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
    return this._service.addTrack(albumId, trackData, this._keyGen);
  }

  getArtistById(id) {
    console.log(this._service.getArtistById(id));
    return this._service.getArtistById(id);
  }

  getAlbumById(id) {
    console.log(this._service.getAlbumById(id));
    console.log();
    return this._service.getAlbumById(id);
  }

  getTrackById(id) {
    console.log(this._service.getTrackById(id));
    return this._service.getTrackById(id);
  }

  getPlaylistById(id) {
    console.log(this._service.getPlaylistById(id));
    return this._service.getPlaylistById(id);
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let track_matching_genres = this._service.getTracksMatchingGenres(genres);
    console.log(track_matching_genres);
    return track_matching_genres;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let track_matching_artist = this._service.getTracksMatchingArtist(
      artistName
    );
    console.log(track_matching_artist);
    return track_matching_artist;
  }

  getTrackByIdAndOwner(trackId) {
    return this._service.getTrackByIdAndOwner(trackId);
  }

  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
    /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */
    return this._service.generatePlayList(
      name,
      genresToInclude,
      maxDuration,
      this._keyGen
    );
  }

  createPlaylistWithIDs(name, trackIds) {
    return this._service.createPlaylist(name, trackIds, this._keyGen);
  }

  searchByName(content) {
    console.log(this._service.searchByName(content));
    return this._service.searchByName(content);
  }
  searchArtistByName(content) {
    return this._service.searchArtistByName(content);
  }
  getAlbumsForArtist(artistName) {
    return this._service.getAlbumsForArtist(artistName);
  }

  getAllArtists(name = "") {
    let all_artists = this._service.getAllArtists(name);
    console.log(all_artists);
    return all_artists;
  }
  getAllAlbums(name = "") {
    let all_albums = this._service.getAllAlbums(name);
    console.log(all_albums);
    return all_albums;
  }
  getAllTracks() {
    let all_tracks = this._service.getAllTracks();
    console.log(all_tracks);
    return all_tracks;
  }
  getAllPlaylists() {
    let all_playlists = this._service.getAllPlaylists();
    console.log(all_playlists);
    return all_playlists;
  }
  deleteArtist(id) {
    this._service.deleteArtist(id);
  }
  deleteAlbum(id) {
    this._service.deleteAlbum(id);
  }
  deleteTrack(id) {
    this._service.deleteTrack(id);
  }
  deletePlayList(id) {
    this._service.deletePlayList(id);
  }

  populateAlbumsForArtist(artist_name) {
    return new SpotifyService()
      .populateAlbumsForArtist(artist_name)
      .then((albums) => {
        const artist = this.searchArtistByName(artist_name)[0];
        const map = {};
        albums.forEach((album) => {
          map[album.name] = album;
        });
        console.log(Object.keys(map).length);
        for (let id in map) {
          let genres = map[id].genres;
          let albumId = this.addAlbum(artist.id, {
            name: map[id].name,
            year: map[id].release_date.split("-")[0],
          }).id;
          map[id].tracks.items.forEach((t) =>
            this.addTrack(albumId, {
              name: t.name,
              duration: t.duration_ms / 1000,
              genres: genres,
            })
          );
        }
        return artist;
      });
  }

  getTrackLyrics(track_id) {
    try {
      const { artist, track } = this.getTrackByIdAndOwner(Number(track_id));

      if (track.lyrics) {
        return Promise.resolve(track);
      } else {
        return this._musixmatchService
          .getSongLyrics(artist, track)
          .then(({ message }) => {
            track.setLyrics(message.body.lyrics.lyrics_body);
            return track;
          });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  searchPlaylistByNameAndDuration(name, durationLT, durationGT) {
    return this._service.searchPlaylistByNameAndDuration(
      name,
      durationLT,
      durationGT
    );
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: "utf-8" });
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [
      UNQfy,
      Artist,
      Service,
      Playlist,
      Album,
      Track,
      KeyGen,
      PlaylistGenerator,
      SpotifyService,
      MusixmatchService,
    ];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy: UNQfy,
};

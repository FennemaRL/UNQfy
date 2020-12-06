const Track = require("./track");
const Artist = require("./artist");
const Album = require("./album");
const Duplicated = require("./duplicated");
const PlaylistGenerator = require("./playlistGenerator");
const Playlist = require("./playlist");
const NotFound = require("./notFound");
const {Subject, events, actions} = require("./subject");
class Service  extends Subject{
  constructor() {
    super()
    this._artists = {};
    this._playlists = {};
    this._playlistGenerator = new PlaylistGenerator();
  }

  addArtist(artistData, keyGen) {
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.name === artistData.name) {
        const error_message = `Artist with name ${artistData.name} already exists`
        this.notifyEvent(events.ERROR,{type: actions.ADD, className:artist.constructor.name, error:error_message});
        throw new Duplicated(error_message);
      }
    });
    const id = keyGen.getKeyArtist();
    const newArtist = new Artist(id, artistData.name, artistData.country);
    this._artists[id] = newArtist;
    this.notifyEvent(events.ARTIST,{type: actions.ADD, affected:newArtist, className:newArtist.constructor.name});
    return newArtist;
  }

  addAlbum(artistId, albumData, keyGen) {
    const id = keyGen.getKeyAlbum();
    const newAlbum = new Album(id, artistId, albumData.name, albumData.year);
    const artistFind = this._artists[artistId];
    if (!artistFind) {
      const error_message = `Artist with ID ${artistId} was not found`
      this.notifyEvent(events.ERROR,{type: actions.ADD, className:newAlbum.constructor.name, error:error_message});
      throw new NotFound(error_message);
    }
    artistFind.addAlbum(newAlbum);
    return newAlbum;
  }

  addTrack(albumId, trackData, keyGen) {
    const id = keyGen.getKeyTrack();
    let albumOwner;
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist && artist.hasAlbumWithId(albumId)) {
        albumOwner = artist;
      }
    });
    if (!albumOwner) {
      const error_message = `Album with ID ${albumId} was not found`
      this.notifyEvent(events.ERROR,{type: actions.ADD, className:"Track", error:error_message});
      throw new NotFound(error_message);
    }

    const createdTrack = new Track(
      id,
      albumId,
      trackData.name,
      trackData.duration,
      trackData.genres
    );
    albumOwner.addSongToAlbum(albumId, createdTrack);
    return createdTrack;
  }

  generatePlayList(name, genresToInclude, maxDuration, keyGen) {
    const id = keyGen.getKeyPlayList();
    let playlist = this._playlistGenerator.generate(
      id,
      name,
      genresToInclude,
      maxDuration,
      this._artists
    );
    this._playlists[id] = playlist;
    return playlist;
  }

  searchByName(content) {
    let res = {
      artists: this.searchArtistByName(content),
      albums: this.searchAlbumByName(content),
      tracks: this.searchTrackByName(content),
      playlists: this.searchPlaylistByName(content),
    };

    return res;
  }
  searchArtistByName(content) {
    let artist_with_name = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      artist.name.includes(content) ? artist_with_name.push(artist) : undefined;
    });
    return artist_with_name;
  }
  searchAlbumByName(content) {
    let album_with_name = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      album_with_name = album_with_name.concat(
        artist.searchAlbumByName(content)
      );
    });
    return album_with_name;
  }
  searchTrackByName(content) {
    let track_with_name = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      track_with_name = track_with_name.concat(
        artist.searchTrackByName(content)
      );
    });
    return track_with_name;
  }
  searchPlaylistByName(content) {
    //falta generar playlist.js y logica
    const playlist_with_name = [];
    Object.keys(this._playlists).forEach((playlistId) => {
      let playlist = this._playlists[playlistId];
      playlist.name.includes(content)
        ? playlist_with_name.push(playlist)
        : undefined;
    });
    return playlist_with_name;
  }

  getTracksMatchingGenres(genres) {
    let tracks = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      tracks = tracks.concat(artist.getTracksMatchingGenres(genres));
    });
    return tracks;
  }
  getTracksMatchingArtist(artistName) {
    let tracks = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      tracks = tracks.concat(artist.getTracksMatchingArtist(artistName));
    });
    return tracks;
  }
  getAlbumsForArtist(artistName) {
    let artist_with_name_exists = false;
    let albums = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.name == artistName) {
        artist_with_name_exists = true;
        albums = artist.getAllAlbums();
      }
    });
    if (!artist_with_name_exists) {
      throw new NotFound(`Artist with name "${artistName}" was not found`);
    }
    return albums;
  }

  getAllArtists(name) {
    let artists = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
        artists.push(artist);
      }
    });
    return artists;
  }
  getAllAlbums(name) {
    let albums = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      albums = albums.concat(artist.getAllAlbums());
    });
    albums = albums.filter((album) =>
      album.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    );
    return albums;
  }
  getAllTracks() {
    let tracks = [];
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      tracks = tracks.concat(artist.getAllTracks());
    });
    return tracks;
  }
  getAllPlaylists() {
    return this._playlists;
  }

  getArtistById(id) {
    let artist_with_id = this._artists[id];
    if (!artist_with_id) {
      throw new NotFound(`Artist with ID ${id} was not found`);
    }
    return artist_with_id;
  }
  getAlbumById(id) {
    let album_owner = undefined;

    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.hasAlbumWithId(id)) {
        album_owner = artist;
      }
    });
    if (!album_owner) {
      throw new NotFound(`Album with ID ${id} was not found`);
    }
    return album_owner.getAlbumById(id);
  }
  getTrackById(id) {
    let track_owner = undefined;
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.hasTrackWithId(id)) {
        track_owner = artist;
      }
    });
    if (!track_owner) {
      throw new NotFound(`Track with ID ${id} was not found`);
    }
    return track_owner.getTrackById(id);
  }

  getTrackByIdAndOwner(id) {
    let track_owner = undefined;
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.hasTrackWithId(id)) {
        track_owner = artist;
      }
    });
    if (!track_owner) {
      throw new NotFound(`Track with ID ${id} was not found`);
    }
    return { artist: track_owner, track: track_owner.getTrackById(id) };
  }
  getPlaylistById(id) {
    let playlist_with_id = this._playlists[id];
    if (!playlist_with_id) {
      throw new NotFound(`Playlist with ID ${id} was not found`);
    }
    return playlist_with_id;
  }

  deleteArtist(artistID) {
    let artist_to_delete = this._artists[artistID];
    if (!artist_to_delete) {
      const error_message = `Artist with ID ${artistID} was not found`
      this.notifyEvent(events.ERROR,{type: actions.DELETE, className:"Artist", error:error_message});
      throw new NotFound(error_message);
    } else {
      delete this._artists[artistID];
      let tracks_to_delete = artist_to_delete.getAllTracks();
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.deleteTracks(tracks_to_delete);
      });
      this.notifyEvent(events.ARTIST,{type: actions.DELETE, affected:artist_to_delete, className:artist_to_delete.constructor.name});
    }
  }
  deleteAlbum(albumID) {
    let album_owner = undefined;
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.hasAlbumWithId(albumID)) {
        album_owner = artist;
      }
    });
    if (!album_owner) {
      const error_message = `Album with ID ${albumID} was not found`
      this.notifyEvent(events.ERROR,{type: actions.DELETE, className:"Album", error:error_message});
      throw new NotFound(error_message);
    } else {
      let album_to_delete = album_owner.deleteAlbum(albumID);
      let tracks_to_delete = album_to_delete.tracks;
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.deleteTracks(tracks_to_delete);
      });
    }
  }
  deleteTrack(trackID) {
    let track_owner = undefined;
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.hasTrackWithId(trackID)) {
        track_owner = artist;
      }
    });
    if (!track_owner) {
      const error_message = `Track with ID ${trackID} was not found`
      this.notifyEvent(events.ERROR,{type: actions.DELETE, className:"Album", error:error_message});
      throw new NotFound(error_message);
    } else {
      let track_to_delete = track_owner.deleteTrack(trackID);
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.deleteTracks(track_to_delete);
      });
    }
  }
  deletePlayList(playlistID) {
    let playlist_to_eliminate = this._playlists[playlistID];
    if (!playlist_to_eliminate) {
      throw new NotFound(`Playlist with ID ${playlistID} was not found`);
    } else {
      delete this._playlists[playlistID];
    }
  }

  updateArtistName(id, name) {
    Object.keys(this._artists).forEach((artistId) => {
      let artist = this._artists[artistId];
      if (artist.name === name) {
        const error_message = `Artist with name ${artistData.name} already exists`
        this.notifyEvent(events.ERROR,{type: actions.EDIT, className:"Artist", error:error_message});
        throw new Duplicated(error_message);
      }
    });

    let artist_with_id = this._artists[id];
    if (!artist_with_id) {
      const error_message = `Artist with ID ${id} was not found`
      this.notifyEvent(events.ERROR,{type: actions.EDIT, className:"Artist", error:error_message});
      throw new NotFound(error_message);
    }
    artist_with_id.name = name;
    return artist_with_id;
  }

  updateArtistCountry(id, country) {
    let artist_with_id = this._artists[id];
    if (!artist_with_id) {
      const error_message = `Artist with ID ${id} was not found`
      this.notifyEvent(events.ERROR,{type: actions.EDIT, className:"Artist", error:error_message});
      throw new NotFound(error_message);
    }
    artist_with_id.country = country;
    return artist_with_id;
  }

  updateAlbum(id, year) {
    let album_with_id = getAlbumById(id);
    if (!album_with_id) {
      const error_message = `Album with ID ${id} was not found`
      this.notifyEvent(events.ERROR,{type: actions.EDIT, className:"Album", error:error_message});
      throw new NotFound(error_message);
    }
    album_with_id.updateAlbum(year);
    return album_with_id;
  }

  createPlaylist(name, trackIds, keyGen) {
    let playlist_id = keyGen.getKeyPlayList();
    let tracks = [];
    let genres = [];
    let duration = 0;
    for (trackId in trackIds) {
      let track_with_id = getTrackById(trackId);
      if (!track_with_id) {
        throw new NotFound(`Album with ID ${trackId} was not found`);
      } else {
        tracks.push(track_with_id);
      }
    }
    for (track in tracks) {
      genres.concat(track.genres);
      duration += track.duration;
    }
    this._playlists[id] = Playlist(playlist_id, name, genres, duration, tracks);
    return this._playlists[id];
  }

  searchPlaylistByNameAndDuration(name, durationLT, durationGT) {
    const playlists_from_search = [];
    const playlists_from_search_name = [];
    const playlists_from_search_durationLT = [];
    const playlists_from_search_durationGT = [];

    if (!name) {
      playlists_from_search_name = this._playlists;
    } else {
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.name.includes(name)
          ? playlists_from_search_name.push(playlist)
          : undefined;
      });
    }

    if (!durationLT) {
      playlists_from_search_durationLT = this._playlists;
    } else {
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.duration < durationLT
          ? playlists_from_search_durationLT.push(playlist)
          : undefined;
      });
    }

    if (!durationGT) {
      playlists_from_search_durationGT = this._playlists;
    } else {
      Object.keys(this._playlists).forEach((playlistId) => {
        let playlist = this._playlists[playlistId];
        playlist.duration > durationGT
          ? playlists_from_search_durationGT.push(playlist)
          : undefined;
      });
    }

    Object.keys(this._playlists).forEach((playlistId) => {
      let playlist = this._playlists[playlistId];
      playlists_from_search_name.includes(playlist) &&
      playlists_from_search_durationLT.includes(playlist) &&
      playlists_from_search_durationGT.includes(playlist)
        ? playlists_from_search.push(playlist)
        : undefined;
    });

    if (playlists_from_search.length == 0) {
      throw new NotFound(
        `There are no playlists matching the search parameters`
      );
    }
    return playlists_from_search;
  }
}
module.exports = Service;

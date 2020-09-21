const Track = require('./track')
const Artist = require('./artist')
const Album = require('./album')
const PlaylistGenerator = require('./playlistGenerator')
class Service {

    constructor(){
        this._artists = new Map;
        this._playlists = new Map;
        this._playlistGenerator = new PlaylistGenerator();
    }

    addArtist(artistData, keyGen) {
        this._artists.forEach(artist => {
            if (artist.name === artistData.name) {
                throw new Error(`Artist with name ${artistData.name} already exists`)
            }
        })
        const id = keyGen.getKeyArtist();
        const newArtist = new Artist(id, artistData.name, artistData.country);
        this._artists.set(id,newArtist);
        return newArtist;
    }
    
    addAlbum(artistId, albumData, keyGen) {
        const id = keyGen.getKeyAlbum();
        const newAlbum = new Album(id, artistId, albumData.name, albumData.year);
        const artistFind = this._artists.get(artistId);
        if(!artistFind) { 
            throw new Error(`Artist with ID ${artistId} was not found`)
        }
        artistFind.addAlbum(newAlbum);
        return newAlbum;
    }

    addTrack(albumId, trackData, keyGen) {
        const id = keyGen.getKeyTrack();
        let albumOwner;
        this._artists.forEach(artist => {
            if(artist && artist.hasAlbumWidthId(albumId)){albumOwner= artist;
            }})
        if(!albumOwner){
            throw new Error(`Album with ID ${albumId} was not found`)
        }
        
        const createdTrack = new Track(id, albumId, trackData.name, trackData.duration, trackData.genres);
        albumOwner.addSongToAlbum(albumId, createdTrack)
        return createdTrack;
    }

    generatePlayList(name, genresToInclude, maxDuration,keyGen) {
        const id = keyGen.getKeyPlayList();
        let playlist = this._playlistGenerator.generate(id,name,genresToInclude, maxDuration, this._artists)
        this._playlists.set(id,playlist)
        return playlist
    }

    searchByName(content) {
        let res = {
            artists: this.searchArtistByName(content), 
            albums: this.searchAlbumByName(content), 
            tracks: this.searchTrackByName(content),
            playlists: this.searchPlaylistByName(content)
        }
        console.log(res)

        return res;
    }
    searchArtistByName(content) {
        let artist_with_name = []
        this._artists.forEach(artist => artist.name.includes(content)?artist_with_name.push(artist):undefined)
        return artist_with_name
    }
    searchAlbumByName(content) {
        let album_with_name = []
        this._artists.forEach(artist => album_with_name = album_with_name.concat(artist.searchAlbumByName(content)))
        return album_with_name
    }
    searchTrackByName(content) {
        let track_with_name = []
        this._artists.forEach(artist => {track_with_name = track_with_name.concat(artist.searchTrackByName(content));})
        return track_with_name
    }
    searchPlaylistByName(content) { //falta generar playlist.js y logica
        const playlist_with_name = []
        this._playlists.forEach(playlist => {playlist.name.includes(content)?playlist_with_name.push(playlist):undefined})
        return playlist_with_name
    }

    getTracksMatchingGenres(genres) {
        let tracks = []
        this._artists.forEach(artist => tracks = tracks.concat(artist.getTracksMatchingGenres(genres)));
        return tracks
    }
    getTracksMatchingArtist(artistName) {
        let tracks = []
        this._artists.forEach(artist => tracks = tracks.concat(artist.getTracksMatchingArtist(artistName)));
        return tracks
    }

    getAllArtists() {
        //this._artists.forEach(artist => console.log(artist))
        return this._artists
    }
    getAllAlbums() {
        let albums = []
        this._artist.forEach(artist => albums.concat(artist.getAllAlbums()))
        //albums.forEach(album => console.log(album))
        return albums
    }
    getAllTracks() {
        let tracks = []
        this._artist.forEach(artist => tracks.concat(artist.getAllTracks()))
        //tracks.forEach(track => console.log(track))
        return tracks
    }
    getAllPlaylists() {
        //this._playlists.forEach(playlist => console.log(playlist))
        return this._playlists
    }

    getArtistById(id) {
        let artist_with_id = this._artists.get(id)
        if (!artist_with_id) {
            throw new Error (`Artist with ID ${id} was not found`)
        }
        return artist_with_id
    }
    getAlbumById(id) {
        let album_owner = undefined
        this._artists.forEach(artist => 
            {
                if (artist.hasAlbumWithId(id)) {
                    album_owner = artist
                }
            }
        )
        if (!album_owner) {
            throw new Error(`Album with ID ${id} was not found`)
        } else {
            return album_owner.getAlbumById(id)
        }
    }
    getTrackById(id) {
        let track_owner = undefined
        this._artists.forEach(artist => 
            {
                if (artist.hasTrackWithId(id)) {
                    track_owner = artist
                }
            }
        )
        if (!track_owner) {
            throw new Error(`Track with ID ${id} was not found`)
        } else {
            return track_owner.getTrackById(id)
        }
    }
    getPlaylistById(id) {
        let playlist_with_id = this._playlists.get(id)
        if (!playlist_with_id) {
            throw new Error (`Playlist with ID ${id} was not found`)
        }
        return playlist_with_id
    }


    deleteArtist(artistID) {
        let artist_to_delete = this._artists.get(artistID)
        if (!artist_to_delete) {
            throw new Error(`Artist with ID ${artistID} was not found`)
        } else {
            this._artists.delete(artistID)
            let tracks_to_delete = artist_to_delete.getAllTracks()
            this._playlists.forEach(playlist => playlist.deleteTracks(tracks_to_delete))
            //artist_to_delete.getAllAlbums().forEach(album => this.deleteAlbum(album.id))
        }
    }
    deleteAlbum(albumID) {
        let album_owner = undefined
        this._artists.forEach(artist => 
            {
                if (artist.hasAlbumWithId(albumID)) {
                    album_owner = artist
                }
            }
        )
        if (!album_owner) {
            throw new Error(`Album with ID ${albumID} was not found`)
        } else {
            let album_to_delete = album_owner.deleteAlbum(albumID)
            let tracks_to_delete = album_to_delete.tracks
            this._playlists.forEach(playlist => playlist.deleteTracks(tracks_to_delete))
        }
    }
    deleteTrack(trackID) {
        let track_owner = undefined
        this._artists.forEach(artist => 
            {
                if (artist.hasTrackWithId(trackID)) {
                    track_owner = artist
                }
            }
        )
        if (!track_owner) {
            throw new Error(`Track with ID ${trackID} was not found`)
        } else {
            let track_to_delete = track_owner.deleteTrack(trackID)
            this._playlists.forEach(playlist => playlist.deleteTracks(track_to_delete))
        }
    }
    deletePlaylist(playlistID) {
        let playlist_to_eliminate = this._playlists.get(playlistID)
        if (!playlist_to_eliminate) {
            throw new Error(`Playlist with ID ${playlistID} was not found`)
        } else {
            this._playlists.delete(playlistID)
        }
    }
}
module.exports = Service;
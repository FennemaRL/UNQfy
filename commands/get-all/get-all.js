const Command = require('../command')

let commands = []

let commandGetArtist = (unquify, data) => unquify.getAllArtists()
commands.push(new Command("GetArtistAll", commandGetArtist))

let commandGetAlbum = (unquify, data) => unquify.getAllAlbums()
commands.push(new Command("GetAlbumAll", commandGetAlbum))

let commandGetTrack = (unquify, data) => unquify.getAllTracks()
commands.push(new Command("GetTrackAll", commandGetTrack))

let commandGetPlayList = (unquify, data) => unquify.getAllPlaylists()
commands.push(new Command("GetPlayListAll", commandGetPlayList))

module.exports = commands
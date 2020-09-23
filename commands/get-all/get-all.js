const Command = require('../command')

let commands  =[]

let commandGetArtist= (unquify, data) => unquify.getAllArtists()
commands.push(new Command("GetArtistAll", commandGetArtist))

let commandGetAlbum= (unquify, data) => unquify.getAllAlbums()
commands.push(new Command("GetAlbumsAll", commandGetAlbum))

let commandGetTrack= (unquify, data) => unquify.getAllTracks()
commands.push(new Command("GetTracksAll", commandGetTrack))

let commandGetPlayList= (unquify, data) => unquify.getAllPlaylists()
commands.push(new Command("GetPlayListsAll", commandGetPlayList))

module.exports = commands
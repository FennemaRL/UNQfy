const Command = require('../command')

let commands  = [] 



let commandGetArtist= (unquify, data) => unquify.getArtistById(data.id)
commands.push(new Command("GetArtist", commandGetArtist))

let commandGetAlbum= (unquify, data) => unquify.getAlbumById(data.id)
commands.push(new Command("GetAlbum", commandGetAlbum))

let commandGetTrack= (unquify, data) => unquify.getTrackById(data.id)
commands.push(new Command("GetTrack", commandGetTrack))

let commandGetPlayList= (unquify, data) => unquify.getPlaylistById(data.id)
commands.push(new Command("GetPlayList", commandGetPlayList))


module.exports = commands
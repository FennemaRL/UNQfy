const Command = require('../command')
let commands =[]


let commandAddArtist= (unquify, data) => unquify.addArtist(data)
commands.push(new Command("AddArtist", commandAddArtist))


let commandAddTrack= (unquify, data) => unquify.addTrack(data.albumId, data)
commands.push(new Command("AddTrack", commandAddTrack))

let commandAddAlbum= (unquify, data) => unquify.addAlbum(data.artistId, data)
commands.push(new Command("AddAlbum", commandAddAlbum))

let commandCreatePlaylist= (unquify, data) => unquify.createPlaylist(data.name, data.genres, data.maxDuration)
commands.push(new Command("CreatePlaylist", commandCreatePlaylist))

module.exports = commands
const Command = require('../command')
let commands =[]

let commandDeleteArtist= (unquify, data) => unquify.deleteArtist(data.id)
commands.push(new Command("DeleteArtist", commandDeleteArtist))

let commandDeleteAlbum= (unquify, data) => unquify.deleteAlbum(data.id)
commands.push(new Command("DeleteAlbum", commandDeleteAlbum))

let commandDeleteTrack= (unquify, data) => unquify.deleteTrack(data.id)
commands.push(new Command("DeleteTrack", commandDeleteTrack))

let commandDeletePlayList= (unquify, data) => unquify.deletePlayList(data.id)
commands.push(new Command("DeletePlayList", commandDeletePlayList))


module.exports = commands
const { event} = require("./subject")
const rp = require("request-promise");
require('dotenv').config()

let count = 0;
class Observer {
    constructor() {
        if (!Observer._instance) {
            Observer._instance = this;
            console.log("Dentro de observer:"+count)
            count++;
            event.on('addArtist', (artist) =>{
                var options = {
                uri: `${process.env.NEWS}/notify_new_album`,
                body: {artistId: artist.id, subject: `Nuevo Album para artista ${artist.name}`, message: `Se ha agregado el album ${artist.getAllAlbums()[artist.getAllAlbums().length-1].name} al artista ${artist.name}`, artistName: artist.name},
                json: true,
            };
            rp.post(options).then(res => console.log(res)).catch(console.log)
          })
        }
        console.log("Dentro de observer:"+count)
        return Observer._instance;
    }
    disconect(){
        event.off('addArtist')
    }
}


module.exports = Observer;


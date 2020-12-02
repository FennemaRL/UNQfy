const { event,events} = require("./subject")
const rp = require("request-promise");
require('dotenv').config()

class Observer {
    constructor() {
        if (!Observer._instance) {
            Observer._instance = this;
            notifyNesLetter()
            notifyLogger()
        }
        console.log("Dentro de observer:"+count)
        return Observer._instance;
    }
    disconect(){
        event.off('addAlbum')
    }
    notifyNesLetter(){
        event.on(events.ADDALBUM, (artist) =>{
            var options = {
            uri: `${process.env.NEWS}/notify_new_album`,
            body: {artistId: artist.id, subject: `Nuevo Album para artista ${artist.name}`, message: `Se ha agregado el album ${artist.getAllAlbums()[artist.getAllAlbums().length-1].name} al artista ${artist.name}`, artistName: artist.name},
            json: true,
        };
        rp.post(options).then(res => console.log(res)).catch(console.log)
      })
    }
    notifyLogger(){
        Object.values(events).forEach(eventName=> {
           /* event.on(eventName,(affected)=>{
            rp.post({uri:`${process.env.LOG}/${eventName}`, body:{affected}, json:true})

            })*/
        })
    }
}


module.exports = Observer;


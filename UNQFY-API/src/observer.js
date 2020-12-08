const { event,events, actions} = require("./subject")
const rp = require("request-promise");
require('dotenv').config()

class Observer {
    constructor() {
        if (!Observer._instance) {
            Observer._instance = this;
            this.notifyNewsLetter()
            this.subscribeEvents()
        }
        return Observer._instance;
    }
    disconect(){
        for (let eventName in events) {
            event.off(eventName)
        }
    }
    notifyNewsLetter(){
        event.on(events.ALBUM, (payload) =>{
            if(payload.type == actions.ADD){
                const options = {
                    uri: `${process.env.NEWS}/notify_new_album`,
                    body: {artistId: payload.affectedArtist.id, subject: `Nuevo Album para artista ${payload.affectedArtist.name}`, message: `Se ha agregado el album ${payload.affected.name} al artista ${payload.affectedArtist.name}`, artistName: payload.affectedArtist.name},
                    json: true,
                };
                rp.post(options)
            }
      })
    }
    subscribeEvents(){
        for (let eventName of Object.values(events)) {
            event.on(eventName, (payload) =>{
                this.notifyLogger(payload,eventName != events.ERROR ?this.getBodyEntity : this.getBodyEntityError)
            })
        }
    }

    notifyLogger(payload,getBody){
        const options = {
            uri: `${process.env.LOGG}/logg`,
            body: getBody(payload.type, payload.className,payload.affected, payload.error),
            json: true,
        };
    rp.post(options)
    }

    getBodyEntityError(action,ClassName,affected,error){
        switch (action) {
            case actions.ADD :
               return { severity: 'error', message:`Error al intentar agregar ${ClassName}: ${error}`}
            
            case actions.DELETE :
                return { severity: 'error', message:`Error al intentar borrar ${ClassName}:  ${error}`}
            
        }
    }

    getBodyEntity(action,ClassName,affected,error){
        switch (action) {
            case actions.ADD :
               return { severity: 'info', message:`se agrego el ${ClassName} con id: ${affected.id}`}
            
            case actions.DELETE :
                return { severity: 'info', message:`se borro el ${ClassName} con id: ${affected.id}`}
            
            case actions.EDIT :
                return { severity: 'warning', message:`se modifico el ${ClassName} con id: ${affected.id}`}
            
        }
    }
}


module.exports = Observer;


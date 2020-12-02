const {EventEmitter} = require('events')

const event = new EventEmitter()
const events = {
    ADDALBUM: 'addAlbum',
    DELETEARTIST: 'deleteArtist'
}
class Subject{
    notifyEvent(event,affected){
        event.emit(event,affected)
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> obs)
    }
}

module.exports = {Subject:Subject, event:event, events:events};

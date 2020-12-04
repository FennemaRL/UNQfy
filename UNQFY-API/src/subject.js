const {EventEmitter} = require('events')

const event = new EventEmitter()
const events = {
    ADDALBUM: 'addAlbum',
    DELETEARTIST: 'deleteArtist'
}
class Subject{
    notifyEvent(eventName,affected){
        event.emit(eventName,affected)
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> obs)
    }
}

module.exports = {Subject:Subject, event:event, events:events};

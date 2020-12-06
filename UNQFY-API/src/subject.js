const {EventEmitter} = require('events')

const event = new EventEmitter()
const events = {
    ALBUM: 'Album',
    ARTIST: 'Artist',
    TRACK: 'Track',
    ERROR: 'Error'
}
const actions = {
    DELETE: 'Delete',
    ADD: 'Add',
    EDIT: 'Edit'
}

class Subject{
    notifyEvent(eventName,playLoad){
        event.emit(eventName,playLoad)
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> obs)
    }
}

module.exports = {Subject:Subject, event:event, events:events,  actions:actions};


const {EventEmitter} = require('events')

const event = new EventEmitter()
class Observer {
    constructor() {
    }
    notify(subj){
        event.emit('addArtist',subj)
    }
}

module.exports = { Observer:Observer, event:event};


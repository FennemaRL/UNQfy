const {EventEmitter} = require('events')

const event = new EventEmitter()
class Subject{

    notify(){
        event.emit('addArtist',this)
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> obs)
    }
}

module.exports = {Subject:Subject, event:event};

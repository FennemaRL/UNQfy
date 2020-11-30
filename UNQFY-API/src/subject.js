class Subject{
    constructor(){
        this._subs = [];
    }
    subscribe(obs ){
        this._subs.push(obs);
    }
    notify(){
        this._subs.forEach(obs => obs.notify(this))
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> s=>obs)
    }
}

module.exports = Subject;

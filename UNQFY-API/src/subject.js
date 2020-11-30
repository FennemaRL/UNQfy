class Subject{
    constructor(){
        this._subs = [];
    }
    subscribe(obs ){
        this._subs.push(obs);
    }
    notify(){
        console.log(this._subs, "notify de subs dentro de Subject")
        this._subs.forEach(obs => obs.notify(this))
    }
    unSubscribe(obs){
        this._subs = this._subs.filter(s=> obs)
    }
}

module.exports = Subject;

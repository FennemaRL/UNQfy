class Command {
  
    constructor(criteria, fn) {
      this._criteria = criteria;
      this._fn = fn ;
    }
    canHandle(command){
      return criteria === command
    }
    do(unquify, data){
      return this._fn(unquify,data);
    }
    sameCriteria(criteria ){
      return this._criteria? this._criteria === criteria : true
    }
  }

module.exports = Command
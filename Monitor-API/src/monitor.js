const rp = require("request-promise");
require('dotenv').config()

class Monitor {
  urlList;
  servicesStatus;
  lastStatusLog;
  lastTimeChecked;
  urlDiscord;
  stateListening;
  constructor(){
    this.urlList = JSON.parse(process.env.SERVICE_LIST_WIDTH_NAME);
    this.servicesStatus=new Map();
    this.lastStatusLog = new Map();
    this.lastTimeChecked = undefined;
    this.urlDiscord = process.env.SERVICE_LIST;
    this.stateListening = true
  }
  beginListen(){
    if (!this.stateListening) { return }
    this.urlList.map(([url,name]) => {
      rp.get({uri: `${url}/ping`, qs: {}, json: true}).then(res => this.notifyDiscord(url,name,res.message)).catch(e=> this.notifyDiscord(url,name,'error'))
    });
    setTimeout(()=>{this.beginListen()},15000);
  }
  notifyDiscord(url,name,value){
    this.lastTimeChecked = new Date()
    if(this.servicesStatus[url] != value){
      this.servicesStatus[url] = value
        const message = `Fecha:${this.lastTimeChecked} | ` + (value === 'error' ? `el servicio ${name} ha dejado de funcionar` : `el servicio ${name} ha vuelto a la normalidad`)
        this.lastStatusLog[name] = message

      rp.post({uri: `${process.env.DISCORD_URI}?wait=true`, qs: {}, json: true, body: {"content": message}})
    }
  }
  startListening() {
    this.stateListening = true
  }
  stopListening() {
    this.stateListening = false
  }

  getServicesStatus() {
    return {status: this.lastStatusLog, lastTimeChecked: this.lastTimeChecked.toTimeString()
    }
  }
}

const monitor = new Monitor()
module.exports = {monitor:monitor}
const express = require("express");
const app = express();
const rp = require("request-promise");
require('dotenv').config()

class Monitor {
  urlList;
  servicesStatus;
  urlDiscord;
  constructor(){
    this.urlList = JSON.parse(process.env.SERVICE_LIST_WIDTH_NAME);
    this.servicesStatus=new Map();
    this.urlDiscord =  process.env.SERVICE_LIST;
  }
  beginListen(){
    /**
     *  @Todo
     */
    this.urlList.map(([url,name]) => {
      rp.get({uri: `${url}/ping`, qs: {}, json: true}).then(res => this.notifyDiscord(url,name,res.message)).catch(e=> this.notifyDiscord(url,name,'error'))
    });
    setInterval(()=>{this.beginListen()},15000);
  }
  notifyDiscord(url,name,value){
   if(this.servicesStatus[url] != value){
    this.servicesStatus[url] = value
     const message= value === 'error' ? { message : `Hora:${new Date()}| el servicio ${name} ha dejado de funcionar`} : { message : `Hora:${new Date()}| el servicio ${name} ha vuelto a la normalidad`}
    
     /**@TODO probar con discord mas tarde */
     //rp.post({uri: this.urlDiscord, qs:{}, json:true, body});
   }
  }
}

new Monitor().beginListen();
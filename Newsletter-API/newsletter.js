const express = require("express");
const app = express();
const rp = require("request-promise");
const fs = require("fs");
const util = require("util");
require('dotenv').config()
const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const GMailAPIClient = require('./src/GMailAPIClient');

const gmailClient = new GMailAPIClient();

//utils
const fileUrl= './app_data/dataNS.json'
function getSuscriptions(filename = fileUrl) {
  if (fs.existsSync(filename)) {
    return read(filename)
      .then(
        JSON.parse
      ).then(subs => {
        res = {}
        Object.keys(subs).forEach(k=>res[k]= new Set(subs[k]))
        return res;
      }).catch(err =>({}));
  } else {
    return write(filename, "")
      .then(
        res => ({})
      );
  }
}

function saveSuscriptions(suscriptions,filename = fileUrl) {
  res = {}
  Object.keys(suscriptions).forEach(k=>res[k]= [...(suscriptions[k])])

  return write(filename, JSON.stringify(res))
}

//routes
var router = express.Router();
const bodyParser = require("body-parser");
const BadRequest = require("./src/badRequest");
const { throws } = require("assert");
const NotFound = require("./src/notFound");

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.post("/subscribe", async (req, res) => { /** @TODO hablar inconsistencia artist name/ID */

  let {mail, artistId} = req.body
  if(!mail || ! artistId) {
    throw new BadRequest();
  }
  rp.get({uri: `${process.env.UNQFY}/artists/${artistId}`, qs: {}, json: true})
    .then(response => {
      if (!response) {
        throw new Error("bad request")
      }
      
      return getSuscriptions()
    })
    .then(suscriptions => {
      if (!suscriptions[artistId] || !suscriptions[artistId].size ) {
        suscriptions[artistId] = new Set()
      }
      suscriptions[artistId].add(mail)

      return suscriptions
    })
    .then(suscriptions => saveSuscriptions(suscriptions))
    .then(() => {
      res.status(200).json()
    })
    .catch(err => { /**@TODO refacto error handle middleware */
      if(err instanceof BadRequest){
        res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
      } 
      else if(err.status === 404){
        res.status(404).json({
          status: 404,
          errorCode: "RELATED_RESOURCE_NOT_FOUND"
          })          
      }
      else{
        res.status(500).json({
          status: 500,
          errorCode: "INTERNAL_SERVER_ERROR", error: err.toString()
          }
          )
      }
      
    })
});

router.post("/notify_new_album", async (req, res) => { /** @TODO hablar inconsistencia artist name/ID */
  const { artistId, subject, message } = req.body
  if(!subject || ! artistId || ! message) {
    throw new BadRequest();
  }

  getSuscriptions()
  .then(susbcriptions => {
    if(!subject || ! artistId || ! message) {
      throw new BadRequest();
    }
    console.log(susbcriptions, susbcriptions[artistId])
    return susbcriptions[artistId]})
  .then(setSuscriptors => {
    if(!setSuscriptors) { 
      throw new NotFound()
    }
    return [...setSuscriptors] })  
  .then(apiSuscriptors => {
    return Promise.all(apiSuscriptors.map(suscriptor => {
      gmailClient.send_mail(
        subject,
        [
          message
        ],
        {
          "email": suscriptor
        },
        {
          "name": process.env.NEWSLETTER_NAME,
          "email": process.env.NEWSLETTER_MAIL
        }
      )
    }))
  })
  .then(result => {
    console.log("funca")
    res.status(200).json()
  }) 
  .catch(err => {
    console.log(err)
    if(err instanceof BadRequest){
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
    }
    else if(err instanceof NotFound){
      res.status(404).json({ status: 404, errorCode:"RESOURCE_NOT_FOUND" })
    }
    else {
      res.status(500).json({
        status: 500,
        errorCode: "INTERNAL_SERVER_ERROR"
        }
        )
    }

  })
})

router.delete("/unsubscribe", (req, res) => { /** @TODO hablar inconsistencia artist name/ID */
  let {mail, artistId} = req.body
  if(!mail || ! artistId) {
    throw new BadRequest();
  }
  getSuscriptions()
  .then(subs=>{
    if(!subs[artistId] || ! subs[artistName].has(mail)){
      throw new BadRequest();
    }
    else  if(subs[artistId]){
      subs[artistId].delete(mail)
    }
    if (!subs[artistId].size) {
      delete subs[artistId]
    }
      return subs    
  })
  .then(suscriptions => saveSuscriptions(suscriptions))
  .then(()=> 
  res.status(204).json({ status: 200, message: `${mail} se subscribio al Artista ${artistName}` }))
  .catch(err=>  {
    if(err instanceof BadRequest){
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
    }else{

    res.status(500).json({
      status: 500,
      errorCode: "INTERNAL_SERVER_ERROR"
      })
    } 
  });
});

/** @TODO falta traernos todas las suscripciones de un artist */

/** @TODO falta eliminación de artist y suscripciones */
router.get("/ping",(req,res) => {
  res.status(200).json({message:'pong'})
})
router.get("/subscriptions",(req,res) => {

  const {artistId} = req.query
  getSuscriptions().then(
    subs=>{
    if(! artistId) {
      throw new BadRequest();
    }
  return subs}
  ).then(subs=> {
    res.status(200).json({
      "artistId": artistId,
      "subscriptors": (subs[artistId]||subs[artistId].size)?[...subs[artistId]]:[]
    })
  })
  .catch(e=>{
    if(err instanceof BadRequest){
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
    }
    else{
      res.status(500).json({
        status: 500,
        errorCode: "INTERNAL_SERVER_ERROR"
        }
        )
    }
    })
})

router.delete("/subscriptions", (req, res) => {
  const {artistId} = req.body

  getSuscriptions().
  then(
    subs=>{
      if(! artistId) {
        throw new BadRequest();
      }
    return subs
  })
  .then(
    subs => {
      if(! subs[artistId]){
        throw new NotFound();
      }
      delete subs[artistId]

      return subs
    }
  )
  .then(suscriptions => saveSuscriptions(suscriptions))
  .then(
    result => res.status(200).json({})
  )
  .catch(err => {
    console.log(err)
    if(err instanceof BadRequest){
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
    }
    if(err instanceof NotFound){
      res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" })
    }
    else{
      res.status(500).json({
        status: 500,
        errorCode: "INTERNAL_SERVER_ERROR"
      })
    }
  })


})

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 3001;
app.listen(port);

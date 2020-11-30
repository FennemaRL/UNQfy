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
function getSuscriptions(filename = 'dataNS.json') {
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

function saveSuscriptions(suscriptions,filename = 'dataNS.json') {
  res = {}
  Object.keys(suscriptions).forEach(k=>res[k]= [...(suscriptions[k])])

  return write(filename, JSON.stringify(res))
}

//routes
var router = express.Router();
const bodyParser = require("body-parser");
const BadRequest = require("./src/badRequest");

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.post("/subscribe", async (req, res) => { /** @TODO hablar inconsistencia artist name/ID */

  let {mail, artistName} = req.body
  if(!mail || ! artistName) {
    throw new BadRequest();
  }
  rp.get({uri: `${process.env.UNQFY}/artists/search/${artistName}`, qs: {}, json: true})
    .then(response => {
      if (!response) {
        throw new Error("bad request")
      }
      
      return getSuscriptions()
    })
    .then(suscriptions => {
      if (!suscriptions[artistName] || !suscriptions[artistName].size ) {
        suscriptions[artistName] = new Set()
      }
      suscriptions[artistName].add(mail)

      return suscriptions
    })
    .then(suscriptions => saveSuscriptions(suscriptions))
    .then(() => {
      res.status(201).json({ status: 201, message: `${mail} se subscribio al Artista ${artistName}` })
    })
    .catch(err => {
      if(err instanceof BadRequest){
        res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" })
      }else{
        res.status(500).json({error : err})
      }
      
    })
});

router.post("/notify_new_album", async (req, res) => { /** @TODO hablar inconsistencia artist name/ID */
  const { artistId, subject, message, artistName } = req.body

  console.log(req.body, "estamos en req.body de notify")

  getSuscriptions()
  .then(suscriptions => suscriptions[artistName])
  .then(setSuscriptors => [...setSuscriptors])
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
    console.log(result, "estamos en result feliz de notify")
    res.status(204).json()
  }) /** @TODO hablar 204 por body vacio */
  .catch(err => {
    console.log(err, "estamos en error de notify")
    res.status(404).json({"error":"No anduvo"})
  })
})

router.delete("/unsubscribe", (req, res) => { /** @TODO hablar inconsistencia artist name/ID */
  let {mail, artistName} = req.body
  getSuscriptions()
  .then(subs=>{
    if(subs[artistName]){
      subs[artistName].delete(mail)
    } 
      return subs    
  })
  .then(suscriptions => saveSuscriptions(suscriptions))
  .then(()=> 
  res.status(204).json({ status: 200, message: `${mail} se subscribio al Artista ${artistName}` }))
  .catch(err=>  {
    res.status(404).json({ status: 404, message: err })
  });
});

/** @TODO falta traernos todas las suscripciones de un artist */

/** @TODO falta eliminación de artist y suscripciones */

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 3001;
app.listen(port);

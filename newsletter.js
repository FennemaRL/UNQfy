const express = require("express");
const app = express();
const rp = require("request-promise");
const fs = require("fs");
const util = require("util");
require('dotenv').config()
const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)

//utils
function getSuscriptions(filename = 'dataNS.json') {
  if (fs.existsSync(filename)) {
    return read(filename)
      .then(
        JSON.parse
      );
  } else {
    console.log(filename)
    return write(filename, "")
      .then(
        res => ({})
      );
  }
}

function saveSuscriptions(suscriptions,filename = 'dataNS.json') {
  write(filename, JSON.stringify(suscriptions))
}

//routes
var router = express.Router();
const bodyParser = require("body-parser");
const { response } = require("express");

app.use(bodyParser.json());

router.post("/suscribe", async (req, res) => {
  let {mail, artistName} = req.body

  rp.get({uri: `${process.env.UNQFY}/artists/search/${artistName}`, qs: {}, json: true})
    .then(response => {
      console.log(response)
      if (!response) {
        throw new Error("bad request")
      }
      
      return getSuscriptions()
    })
    .then(suscriptions => {
      if (!suscriptions[artistName]) {
        suscriptions[artistName] = []
      }
      suscriptions[artistName].push(mail)

      return suscriptions
    })
    .then(suscriptions => saveSuscriptions(suscriptions))
    .then(result => {
      res.status(201).json({ status: 201, message: `${mail} suscripted to ${artistName}` })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({error : err})
    })
});

router.post("/unsuscribe", (req, res) => {
  let {mail, artistName} = req.body

  console.log(mail, artistName)
  res.status(201).json({ status: 201, message: "desuscripto" })
});

router.use("/notify_new_album", (req, res) => {});

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 4000;
app.listen(port);

const express = require("express");
const app = express();
require('dotenv').config()
const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
//utils
const fileName= 'app_data/log.txt'
function addLog(stringLog,filename = fileName) {
  if (fs.existsSync(filename)) {
    return read(filename).then(res => write(filename,res+"\n"+stringLog))
  } else {
    return write(filename, stringLog) 
  }
}

var winston  = require('winston');
var {Loggly} = require('winston-loggly-bulk');
winston.add(new Loggly({
    token: process.env.TOKENWINSTON,
    subdomain: process.env.DOMAIN,
    tags: ["Winston-NodeJS"],
    json: true
}));

var Status = { Error: 'error', Info: 'info' }

//routes
var router = express.Router();
router.enableLogg = true;
const bodyParser = require("body-parser");


app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); 
  }
  next();
});

router.patch("/enableLogg", (req, res) => {
  const {enable} = req.query

  if (enable === 'true') {
    router.enableLogg = true
    res.status(200).json({message: "El servicio se ha activado exitosamente"});
  } else if (enable === 'false') {
    router.enableLogg = false
    res.status(200).json({message: "El servicio se ha desactivado exitosamente"});
  } else {
    res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  }
})


router.post("/logg", (req, res) => {
  const {severity, message} = req.body
    if(!severity || ! message || (Status.Error != severity && Status.Info != severity)) {
      res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
      return ;
    }

    if (!router.enableLogg) {
      res.status(200).send({ message: 'el servicio Logg se encuentra desactivado' })
      return;
    }

    Promise.all([Promise.resolve(winston.log(severity, message)),addLog(` status: ${severity}, message: ${message}`)])
    .then(() => res.status(200).json({message: "Se a loggeado correctamente"}))
    .catch(err =>{res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" })}  )
   }  
)

router.get("/ping",(req,res) => {
  res.status(200).json({message:'pong'})
})

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});



const port = process.env.PORT || 3003;
app.listen(port);

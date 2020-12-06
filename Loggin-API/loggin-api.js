const express = require("express");
const app = express();
require('dotenv').config()
const fs = require("fs");
const util = require("util");
const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
//utils
const fileName= 'log.txt'
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
const bodyParser = require("body-parser");

//setTimeout(()=>{monitor.beginListen()},10000);

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.get("/status", (req, res) => {

  /**
   * @TODO running apagar prender
   */
  res.status(200).json();
})

router.patch("/enable", (req, res) => {
  const {enable} = req.query

  if (enable === 'true') {
    res.status(200).json({message: "El servicio se ha activado exitosamente"});
  } else if (enable === 'false') {

    res.status(200).json({message: "El servicio se ha desactivado exitosamente"});
  } else {
    res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  }
})


router.post("/logg", (req, res) => {
  const {severity, message} = req.body
  console.log({severity, message})
    if(!severity || ! message || (Status.Error != severity && Status.Info != severity)) {
      res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
      return ;
    }

    Promise.all([Promise.resolve(winston.log(severity, message)),addLog(` status: ${severity}, message: ${message}`)])
    .then(() => res.status(200).json({message: "Se a loggeado correctamente"}))
    .catch(err =>{ console.log(err); res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" })}  )
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

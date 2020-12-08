const express = require("express");
const app = express();
require('dotenv').config()


//routes
var router = express.Router();
const bodyParser = require("body-parser");
const {monitor} = require("./src/monitor")

setTimeout(()=>{monitor.beginListen()},10000);

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.get("/status", (req, res) => {
  let servicesStatus = monitor.getServicesStatus()
  res.status(200).json(servicesStatus);
})

router.patch("/stateListening", (req, res) => {
  const {enable} = req.query

  if (enable === 'true') {
    monitor.startListening()
    monitor.beginListen()
    res.status(200).json({message: "El servicio se ha activado exitosamente"});
  } else if (enable === 'false') {
    monitor.stopListening()
    res.status(200).json({message: "El servicio se ha desactivado exitosamente"});
  } else {
    res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  }
})

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 3002;
app.listen(port);

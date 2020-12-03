const express = require("express");
const app = express();
const rp = require("request-promise");
require('dotenv').config()


//routes
var router = express.Router();
const bodyParser = require("body-parser");
const BadRequest = require("./src/badRequest");
const NotFound = require("./src/notFound");
const {monitor} = require("./src/monitor")

monitor.beginListen()

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.get("/status", (req, res) => {
  res.status(200).send(monitor.servicesStatus());
})

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 3002;
app.listen(port);

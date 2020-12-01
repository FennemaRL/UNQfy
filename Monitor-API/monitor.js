const express = require("express");
const app = express();
const rp = require("request-promise");
require('dotenv').config()

var router = express.Router();

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});


const port = process.env.PORT || 3001;
app.listen(port);

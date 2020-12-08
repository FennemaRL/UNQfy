const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
const artistRoute = require("./routes/artistRoute");
const albumRoute = require("./routes/albumRoute");
const trackRoute = require("./routes/trackRoute");
const playlistRoute = require("./routes/playlistRoute");
const Observer = require("./src/observer");
const rp = require("request-promise");
require('dotenv').config()
var router = express.Router();
const bodyParser = require("body-parser");
const filenamev='./app_data/data.json'
function getUNQfy(filename = filenamev) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

app.use(bodyParser.json());


router.use(function (req, res, next) {
  req.unquify = getUNQfy();
  req.wc =  new Observer();
  next()
})


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});

router.use("/artists", artistRoute);

router.use("/albums", albumRoute);

router.use("/tracks", trackRoute);

router.use("/playlists", playlistRoute);

app.use("/api", router);
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});

router.get("/ping",(req,res) => {
  res.status(200).json({message:'pong'})
})


const port = process.env.PORT || 3000;
app.listen(port);

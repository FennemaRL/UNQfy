const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
const artistRoute = require("./routes/artistRoute");
const albumRoute = require("./routes/albumRoute");
const trackRoute = require("./routes/trackRoute");
const playlistRoute = require("./routes/playlistRoute");
const {Observer, event} = require("./src/observer")
const rp = require("request-promise");
require('dotenv').config()
var router = express.Router();
const bodyParser = require("body-parser");
const { RSA_PKCS1_OAEP_PADDING } = require("constants");
function getUNQfy(filename = "data.json") {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

app.use(bodyParser.json());


router.use(function (req, res, next) {
  req.unquify = getUNQfy();
  req.wt = new Observer()
  next()
})
event.on('addArtist', (artist) =>{
  console.log(artist, "llega al evento para agregar album")
  var options = {
    uri: `${process.env.NEWS}/notify_new_album`,
    body: {artistId: artist.id, subject: `Nuevo Album para artista ${artist.name}`, message: `Se ha agregado el album ${artist.getAllAlbums()[artist.getAllAlbums().length-1].name} al artista ${artist.name}`, artistName: artist.name},
    json: true,
  };
  rp.post(options).then(res => console.log(res)).catch(console.log)
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


const port = process.env.PORT || 3000;
app.listen(port);

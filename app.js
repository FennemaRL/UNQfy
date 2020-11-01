const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
const Duplicated = require("./src/duplicated");
const NotFound = require("./src/notFound");
const artistRoute = require("./routes/artistRoute");
const albumRoute = require("./routes/albumRoute");
const trackRoute = require("./routes/trackRoute");

var router = express.Router();
const bodyParser = require("body-parser");
function getUNQfy(filename = "data.json") {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

app.use(bodyParser.json());
app.use(function (req, res, next) {
  req.unquify = getUNQfy();
  next();
});

router.use("/artists", artistRoute);

router.use("/albums", albumRoute);

router.use("/tracks", trackRoute);

app.use("/api", router);

const port = process.env.PORT || 3000;
app.listen(port);

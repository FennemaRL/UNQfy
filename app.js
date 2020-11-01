const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
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
app.use(function (req, res) {
  res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" }); // Bad request
  }
  next();
});
const port = process.env.PORT || 3000;
app.listen(port);

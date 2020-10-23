const express = require("express");
const app = express();
const router = express.Router();
const parser = require("body-parser");
const unqmod = require("./unqfy");

const fs = require("fs");

function getUNQfy(filename = "data.json") {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = "data.json") {
  unqfy.save(filename);
}

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/artist/:name", (req, res) => {
  const unqfyR = getUNQfy();
  const artist_name = req.params.name;
  const artist_with_name = unqfyR.searchArtistByName(artist_name);

  if (!artist_with_name) {
    res.status(404);
  }
  res.status(200).json(artist_with_name[0]);
});

const port = process.env.PORT || 5000;
app.listen(port);

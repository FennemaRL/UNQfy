const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
const Duplicated = require("./src/duplicated");
const NotFound = require("./src/notFound");

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

//app.use("/api");

app.get("/artists/:name", (req, res) => {
  const unqfyR = getUNQfy();
  const artist_name = req.params.name;
  const artist_with_name = unqfyR.searchArtistByName(artist_name);

  if (artist_with_name[0]) {
    res.status(200).json({ artist: artist_with_name[0] });
  } else if (artist_with_name[0].albums) {
    unqfyR.populateAlbumsForArtist(artist_name).then(() => {
      saveUNQfy(unqfyR);
      res.status(200).json({ artist: artist_with_name[0] });
    });
  } else {
    res
      .status(400)
      .json({ message: `no hay Artista con nombre ${artist_name}` });
  }
});
app.get("/track/:id/lyrics", async (req, res) => {
  const unqfyR = getUNQfy();
  const track_id = req.params.id;

  unqfyR
    .getTrackLyrics(track_id)
    .then((track) => {
      res.status(200).json({ name: track.name, lyrics: track.lyrics });
    })
    .catch((e) => {
      res.status(404).json({ error: e, errorCode: "RESOURCE_NOT_FOUND" });
    });
});

app.get("/artists/:name/populate", async (req, res) => {
  const unqfyR = getUNQfy();
  const name = req.params.name;

  unqfyR
    .populateAlbumsForArtist(name)
    .then((artist) => {
      saveUNQfy(unqfyR);
      res.status(201).json({ artist: artist, tomaco: 2 });
    })
    .catch((e) =>
      res.status(409).json({ errorCode: "RESOURCE_ALREADY_EXISTS" })
    );
});

app.post("/artists", (req, res) => {
  const { name, country } = req.body;
  const unqfyR = getUNQfy();
  try {
    const artist = unqfyR.addArtist({ name, country });

    saveUNQfy(unqfyR);
    res.status(201).json(artist);
  } catch (e) {
    res.status(409).json({ errorCode: "RESOURCE_ALREADY_EXISTS" });
  }
});
app.get("/artists", (req, res) => {
  const qp = req.query; // TODO
  const unqfyR = getUNQfy();
  let artists = unqfyR.getAllArtists();
  res.status(201).json(artists);
});

app.post("/albums", (req, res) => {
  const { artistId, name, year } = req.body;
  const unqfyR = getUNQfy();
  try {
    const album = unqfyR.addAlbum(artistId, { name, year });
    res.status(201).json(album);
  } catch (e) {
    if (e instanceof Duplicated) {
      res.status(409).json({ errorCode: "RESOURCE_ALREADY_EXISTS" });
    }
    if (e instanceof NotFound) {
      res.status(404).json({ errorCode: "RELATED_RESOURCE_NOT_FOUND" });
    }
  }
});

const port = process.env.PORT || 3000;
app.listen(port);

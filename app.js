const express = require("express");
const app = express();
const unqmod = require("./unqfy");
const fs = require("fs");
const rp = require("request-promise");
require("dotenv").config();
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

app.use("/api");

app.get("/artist/:name", async (req, res) => {
  const unqfyR = getUNQfy();
  const artist_name = req.params.name;
  const artist_with_name = unqfyR.searchArtistByName(artist_name);

  if (artist_with_name) {
    if (!artist_with_name[0].albums) {
      await unqfyR.populateAlbumsForArtist(artist_name).then();
      saveUNQfy(unqfyR);
    }
    res.status(200).json({ artist: artist_with_name[0] });
  } else {
    res
      .status(400)
      .json({ message: `no hay Artista con nombre ${artist_name}` });
  }
});
app.get("/track/:id/lyrics", async (req, res) => {
  const unqfyR = getUNQfy();
  const track_id = req.params.id;
  const { artist, track } = unqfyR.getTrackByIdAndOwner(Number(track_id));

  if (track.lyrics) {
    res.status(200).json({ name: track.name, lyrics: track.lyrics });
  } else {
    const BASE_URL = "http://api.musixmatch.com/ws/1.1";
    var options = {
      uri: `${BASE_URL}/track.search`,
      qs: {
        apikey: process.env.MUSIXMATCH,
        q_artist: artist.name,
        q_track: track.name,
        page_size: 1,
      },
      json: true,
    };

    await rp
      .get(options)
      .then(({ message }) => message.body.track_list[0].track.track_id)
      .then((track_id) => {
        var options = {
          uri: `${BASE_URL}/track.lyrics.get`,
          qs: {
            apikey: process.env.MUSIXMATCH,
            track_id,
          },
          json: true,
        };
        return rp.get(options);
      })
      .then(({ message }) => {
        track.setLyrics(message.body.lyrics.lyrics_body);
        saveUNQfy(unqfyR);
        res
          .status(200)
          .json({ Name: track.name, lyrics: message.body.lyrics.lyrics_body });
      })
      .catch((e) => res.status(400).json({ message: "no se encontro lyrics" }));
  }
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

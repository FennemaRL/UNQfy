const express = require("express");
const unqfy = require("../unqfy");
const router = express.Router();

const { route } = require("./trackRoute");
function saveUNQfy(unqfy, filename = "data.json") {
  unqfy.save(filename);
}
//populate
router.get("/:name/populate", async (req, res) => {
  const unqfyR = req.unquify;
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
// create
router.post("", (req, res) => {
  const { name, country } = req.body;
  const unqfyR = req.unquify;
  try {
    const artist = unqfyR.addArtist({ name, country });

    saveUNQfy(unqfyR);
    res.status(201).json(artist);
  } catch (e) {
    res.status(409).json({ errorCode: "RESOURCE_ALREADY_EXISTS" });
  }
});
//get all
router.get("", (req, res) => {
  const qp = req.query; // TODO
  const unqfyR = req.unquify;
  let artists = unqfyR.getAllArtists();
  res.status(201).json(artists);
});
// get by id
router.get("/:name", (req, res) => {
  const unqfyR = req.unquify;
  const artist_name = req.params.name;
  const artist_with_name = unqfyR.searchArtistByName(artist_name);
  console.log(artist_with_name);
  if (artist_with_name[0]) {
    res.status(200).json({ artist: artist_with_name[0] });
  } else if (artist_with_name[0] && artist_with_name[0].albums) {
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
// update
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const { name, country } = req.body;
  console.log(name);
  const unqfyR = req.unquify;
  try {
    const artist = unqfyR.getArtistById(id);
    if (country) {
      artist.country = country;
    }
    if (name) {
      artist.name = name;
    }
    res.status(200).json(artist);
    saveUNQfy(unqfyR);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e, errorCode: "RESOURCE_NOT_FOUND" });
  }
});
// delete
router.delete("/:id", (req, res) => {
  try {
    const unqfyR = req.unquify;
    const id = req.params.id;
    unqfyR.deleteArtist(id);

    res.status(204).json();
  } catch (e) {
    res.status(404).json({ error: e, errorCode: "RESOURCE_NOT_FOUND" });
  }
});
module.exports = router;

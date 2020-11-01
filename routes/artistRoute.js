const express = require("express");
const unqfy = require("../unqfy");
const BadRequest = require("../src/badRequest");
const NotFound = require("../src/notFound");
const router = express.Router();

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
    if (!name || !country) {
      throw new BadRequest("");
    }
    const artist = unqfyR.addArtist({ name, country });

    saveUNQfy(unqfyR);
    res.status(201).json(artist);
  } catch (e) {
    if (e instanceof NotFound) {
      res
        .status(409)
        .json({ status: 409, errorCode: "RESOURCE_ALREADY_EXISTS" });
    }
    if (e instanceof BadRequest) {
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
    }
  }
});
//get all
router.get("", (req, res) => {
  const qp = req.query; // TODO
  const unqfyR = req.unquify;
  let artists = unqfyR.getAllArtists();
  res.status(200).json(Object.keys(artists).length ? artists : []);
});
// get by id
router.get("/:id", (req, res) => {
  try {
    const unqfyR = req.unquify;
    const artist_name = Number(req.params.id);
    const artist_with_name = unqfyR.getArtistById(artist_name);

    if (artist_with_name) {
      res.status(200).json({ artist: artist_with_name[0] });
    } else if (artist_with_name && artist_with_name[0].albums) {
      unqfyR.populateAlbumsForArtist(artist_name).then(() => {
        saveUNQfy(unqfyR);
        res.status(200).json({ artist: artist_with_name[0] });
      });
    }
  } catch (e) {
    if (e instanceof NotFound)
      res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
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
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
  }
});
// delete
router.delete("/:id", (req, res) => {
  try {
    const unqfyR = req.unquify;
    const id = req.params.id;
    unqfyR.deleteArtist(id);
    saveUNQfy(unqfyR);
    res.status(204).json();
  } catch (e) {
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
  }
});
module.exports = router;

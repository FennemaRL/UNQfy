const express = require("express");
const router = express.Router();

const NotFound = require("../src/notFound");
const Duplicated = require("../src/duplicated");
const requestPromise = require("request-promise");
//add
router.post("/", (req, res) => {
  const { artistId, name, year } = req.body;
  const unqfyR = req.unquify;
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
// by id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const unqfyR = req.unquify;
  try {
    const album = unqfyR.getAlbumById(id);
    res.status(201).json(album);
  } catch (e) {
    console.log(e);
    res.status(404).json({ errorCode: "RELATED_RESOURCE_NOT_FOUND" });
  }
});

//
module.exports = router;

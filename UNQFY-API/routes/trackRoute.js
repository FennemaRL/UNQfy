const express = require("express");
const router = express.Router();
const Duplicated = require("../src/duplicated");
const NotFound = require("../src/notFound");
const { saveUNQfy } = require("../src/utils");
router.post("", (req, res) => {
  try {
    const unqfyR = req.unquify;
    const { albumId, name, duration, genres } = req.body;

    const track = unqfyR.addTrack(albumId, { name, duration, genres });
    saveUNQfy(unqfyR);

    res.status(200).json(track);
  } catch (e) {
    if (e instanceof Duplicated) {
      res
        .status(409)
        .json({ status: 409, errorCode: "RESOURCE_ALREADY_EXISTS" });
    }
    if (e instanceof NotFound) {
      res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
  }
});

router.get("/:id/lyrics", async (req, res) => {
  const unqfyR = req.unquify;
  const track_id = req.params.id;

  unqfyR
    .getTrackLyrics(track_id)
    .then((track) => {
      saveUNQfy(unqfyR);
      res.status(200).json({ name: track.name, lyrics: track.lyrics });
    })
    .catch((e) => {
      res.status(404).json({ error: 404, errorCode: "RESOURCE_NOT_FOUND" });
    });
});

module.exports = router;

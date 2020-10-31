const express = require("express");
const router = express.Router();

router.get("/track/:id/lyrics", async (req, res) => {
  const unqfyR = req.unquify;
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

module.exports = router;

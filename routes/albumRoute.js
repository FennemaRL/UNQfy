const express = require("express");
const router = express.Router();

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

module.exports = router;

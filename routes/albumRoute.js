const express = require("express");
const router = express.Router();

const NotFound = require("../src/notFound");
const Duplicated = require("../src/duplicated");
const requestPromise = require("request-promise");
const unqfy = require("../unqfy");
const BadRequest = require("../src/badRequest");

function saveUNQfy(unqfy, filename = "data.json") {
  unqfy.save(filename);
}
//add
router.post("", (req, res) => {
  const { artistId, name, year } = req.body;
  const unqfyR = req.unquify;
  try {
    if (!artistId || !name || !year) {
      throw new BadRequest("");
    }
    const album = unqfyR.addAlbum(artistId, { name, year });
    saveUNQfy(unqfyR);
    res.status(201).json(album);
  } catch (e) {
    if (e instanceof BadRequest) {
      res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
    }
    if (e instanceof Duplicated) {
      res
        .status(409)
        .json({ status: 409, errorCode: "RESOURCE_ALREADY_EXISTS" });
    }
    if (e instanceof NotFound) {
      res
        .status(404)
        .json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
    }
  }
});

//get all
router.get("", (req, res) => {
  // falta query params
  try {
    const unqfyR = req.unquify;
    const album = unqfyR.getAllAlbums();
    res.status(200).json(album);
  } catch (e) {
    res
      .status(404)
      .json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
  }
});
//get by id
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const unqfyR = req.unquify;
    const album = unqfyR.getAlbumById(id);
    res.status(200).json(album);
  } catch (e) {
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
  }
});

//update
router.patch("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const { year } = req.body;

    const unqfyR = req.unquify;
    const album = unqfyR.getAlbumById(id);
    if (year) {
      album.updateYear(year);
      saveUNQfy(unqfyR);
    }

    res.status(201).json(album);
  } catch (e) {
    res
      .status(404)
      .json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
  }
});
//delete
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const unqfyR = req.unquify;
    const album = unqfyR.deleteAlbum(id);
    saveUNQfy(unqfyR);
    res.status(204).json();
  } catch (e) {
    res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
  }
});
module.exports = router;

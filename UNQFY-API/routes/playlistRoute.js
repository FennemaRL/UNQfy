const express = require("express");
const router = express.Router();

const NotFound = require("../src/notFound");
const requestPromise = require("request-promise");
const unqfy = require("../unqfy");
const BadRequest = require("../src/badRequest");
const filenamev='./app_data/data.json'
function saveUNQfy(unqfy, filename = filenamev) {
    unqfy.save(filename);
}

//add by duration and genres
router.post("", (req, res) => {
    const { name, maxDuration, genres } = req.body;
    const unqfyR = req.unquify;

    try {
        if (!name || !maxDuration || !genres) {
            throw new BadRequest("");
        }
        const playlist = unqfyR.createPlaylist(name, genres, maxDuration);
        saveUNQfy(unqfyR);
        res.status(201).json(playlist);
    } catch (e) {
        if (e instanceof BadRequest) {
            res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
        }
    }
});

//add by track IDs
router.post("", (req, res) => {
    const { name, tracks } = req.body;
    const unqfyR = req.unquify;

    try {
        if (!name || !tracks ) {
            throw new BadRequest("");
        }
        const playlist = unqfyR.createPlaylistByIDs(name, tracks);
        saveUNQfy(unqfyR);
        res.status(201).json(playlist);
    } catch (e) {
        if (e instanceof BadRequest) {
            res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
        }
        if (e instanceof NotFound) {
            res
            .status(404)
            .json({ status: 404, errorCode: "RELATED_RESOURCE_NOT_FOUND" });
        }
    }
});

//get by ID
router.get("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const unqfyR = req.unquify;
        const playlist = unqfyR.getPlaylistById(id);
        res.status(200).json(playlist);
    } catch (e) {
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
});

//delete
router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const unqfyR = req.unquify;
        const playlist = unqfyR.deletePlaylist(id);
        saveUNQfy(unqfyR);
        res.status(204).json();
    } catch (e) {
        res.status(404).json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
    }
});

//search by name and/or durations
router.get("", (req, res) => {
    const { name, durationLT, durationGT } = req.body

    try {
        if (!name && !durationLT && !durationGT ) {
            throw new BadRequest("");
        }
        const unqfyR = req.unquify;
        const playlists = unqfyR.searchPlaylistByNameAndDuration(name, durationLT, durationGT);
        res.status(200).json(playlists);
    } catch (e) {
        if (e instanceof BadRequest) {
            res.status(400).json({ status: 400, errorCode: "BAD_REQUEST" });
        }
        if (e instanceof NotFound) {
            res
            .status(404)
            .json({ status: 404, errorCode: "RESOURCE_NOT_FOUND" });
        }
    }
});

module.exports = router;  
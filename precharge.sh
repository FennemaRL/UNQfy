#!/bin/bash
rm data.json
node main.js AddArtist name "Guns N Roses" country "England"
node main.js AddAlbum artistId 1 name "Guns N Roses album" year "2005"
node main.js AddTrack albumId 1 name "Guns N Roses song" duration 300 genres ["rock"]
node main.js CreatePlaylist name "Guns N Roses PlayList"  genres ["rock"] maxDuration 300
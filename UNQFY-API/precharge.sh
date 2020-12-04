#!/bin/bash
rm data.json
echo "iniciando precarga"
node main.js AddArtist name "Guns N Roses" country "England"
node main.js AddAlbum artistId 1 name "Guns N Roses album" year "2005"
node main.js AddTrack albumId 1 name "Guns N Roses song" duration 300 genres ["rock"]
node main.js AddTrack albumId 1 name "Guns N Roses song1" duration 300 genres ["rock"]
node main.js AddTrack albumId 1 name "Guns N Roses song3" duration 50 genres ["rock"]
node main.js AddTrack albumId 1 name "Guns N Roses song4" duration 100 genres ["rock"]
node main.js AddTrack albumId 1 name "Guns N Roses song5" duration 200 genres ["rock"]
node main.js AddTrack albumId 1 name "Guns N Roses song6" duration 200 genres ["rock"]
node main.js CreatePlaylist name "Guns N Roses PlayList"  genres ["rock"] maxDuration 500

node main.js AddArtist name "ACDC" country "England"
node main.js AddAlbum artistId 2 name "ACDC album" year "2005"
node main.js AddTrack albumId 2 name "ACDC song" duration 300 genres ["rock"]
node main.js AddTrack albumId 2 name "ACDC song1" duration 300 genres ["rock"]
node main.js AddTrack albumId 2 name "ACDC song3" duration 50 genres ["rock"]
node main.js AddTrack albumId 2 name "ACDC song4" duration 100 genres ["rock"]
node main.js AddTrack albumId 2 name "ACDC song5" duration 200 genres ["rock"]
node main.js AddTrack albumId 2 name "ACDC song6" duration 200 genres ["rock"]
node main.js CreatePlaylist name "ACDC PlayList"  genres ["rock"] maxDuration 200

node main.js AddArtist name "Disturbed" country "England"
node main.js AddAlbum artistId 3 name "Disturbed album" year "2008"
node main.js AddTrack albumId 3 name "Disturbed song" duration 300 genres ["rock"]
node main.js AddTrack albumId 3 name "Disturbed song1" duration 300 genres ["rock"]
node main.js AddTrack albumId 3 name "Disturbed song3" duration 50 genres ["rock"]
node main.js AddTrack albumId 3 name "Disturbed song4" duration 100 genres ["rock"]
node main.js AddTrack albumId 3 name "Disturbed song5" duration 200 genres ["rock"]
node main.js AddTrack albumId 3 name "Disturbed song6" duration 200 genres ["rock"]
node main.js CreatePlaylist name "Disturbed PlayList"  genres ["rock"] maxDuration 1200

echo "precarga completa"
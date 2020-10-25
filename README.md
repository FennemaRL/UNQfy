# UNQfy

## UML UNQfy

https://app.lucidchart.com/documents/edit/a22c1f6c-1c12-46e0-b84e-17849ed26f9e/0_0#?folder_id=home&browser=icon

## Pre requisitos

Poseer [node.js](https://nodejs.org/en/) instalado

**Precarga de datos para pruebas** => bash preg
**Comandos válidos:** bash precharge.sh

## Detalle de métodos

    Métodos Add

- node main.js **AddArtist** name _name_ country _country_

Ejemplo -> node main.js AddArtist name "Guns N Roses" country "England"

- node main.js **AddAlbum** artistId _artistId_ name _name_ year _year_

Ejemplo -> node main.js AddAlbum artistId 1 name "Guns N Roses album" year "2005"

- node main.js **AddTrack** albumId _albumId_ name _name_ duration _duration_ genres _genres_

Ejemplo -> node main.js AddTrack albumId 1 name "Guns N Roses song" duration 300 genres ["rock"]

- node main.js **CreatePlaylist** name _name_ genres _genres_ maxDuration _maxDuration_

Ejemplo -> node main.js CreatePlaylist name "Guns N Roses PlayList" genres ["rock"] maxDuration 300

    Métodos Delete

- node main.js **DeleteArtist** id _id_

Ejemplo -> node main.js DeleteArtist id "1"

- node main.js **DeleteAlbum** id _id_

Ejemplo -> node main.js DeleteAlbum id "1"

- node main.js **DeleteTrack** id _id_

Ejemplo -> node main.js DeleteTrack id "1"

- node main.js **DeletePlayList** id _id_

Ejemplo -> node main.js DeletePlayList id "1"

    Métodos GetParse y Search

- node main.js **GetParseMatch** content _content_

node main.js GetParseMatch content <string>
Ejemplo -> node main.js GetParseMatch content "Guns"

- node main.js **SearchTracksByArtist** artistName _artistName_

Ejemplo -> node main.js SearchTracksByArtist artistName "Guns N Roses"

- node main.js **SearchTracksByGenres** genres _genres_

Ejemplo -> node main.js SearchTracksByGenres genres ["rock"]

    Métodos GetById

- node main.js **GetArtist** id _id_

Ejemplo -> node main.js GetArtist id "1"

- node main.js **GetAlbum** id _id_

Ejemplo -> node main.js GetAlbum id "1"

- node main.js **GetTrack** id _id_

Ejemplo -> node main.js GetTrack id "1"

- node main.js **GetPlayList** id _id_

Ejemplo -> node main.js GetPlayList id "1"

    Métodos GetAll

- node main.js **GetArtistAll**

Ejemplo -> node main.js GetArtistAll

- node main.js **GetAlbumAll**

Ejemplo -> node main.js GetAlbumAll

- node main.js **GetTrackAll**

Ejemplo -> node main.js GetTrackAll

node main.js GetPlayListsAll

- node main.js **GetPlayListAll**

Ejemplo -> node main.js GetPlayListAll

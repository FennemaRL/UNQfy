# UNQfy

## UML UNQfy

https://app.lucidchart.com/documents/edit/a22c1f6c-1c12-46e0-b84e-17849ed26f9e/0_0#?folder_id=home&browser=icon

## Pre requisitos
Poseer [node.js](https://nodejs.org/en/) instalado

**Precarga de datos para pruebas** => bash preg
**Comandos válidos:** bash precharge.sh

## Detalle de métodos
    Métodos Add

 - node main.js **AddArtist** name *name* country *country*

Ejemplo -> node main.js AddArtist name "Guns N Roses" country "England"

- node main.js **AddAlbum** artistId *artistId* name *name* year *year*

Ejemplo -> node main.js AddAlbum artistId 1 name "Guns N Roses album" year "2005"

- node main.js **AddTrack** albumId *albumId* name *name* duration *duration* genres *genres*

Ejemplo -> node main.js AddTrack albumId 1 name "Guns N Roses song" duration 300 genres ["rock"]

- node main.js **CreatePlaylist** name *name* genres *genres* maxDuration *maxDuration*

Ejemplo -> node main.js CreatePlaylist name "Guns N Roses PlayList" genres ["rock"] maxDuration 300

	Métodos Delete

- node main.js **DeleteArtist** id *id*

Ejemplo -> node main.js DeleteArtist id "1"

- node main.js **DeleteAlbum** id *id*

Ejemplo -> node main.js DeleteAlbum id "1"

- node main.js **DeleteTrack** id *id*

Ejemplo -> node main.js DeleteTrack id "1"

- node main.js **DeletePlayList** id *id*

Ejemplo -> node main.js DeletePlayList id "1"

	Métodos GetParse y Search

- node main.js **GetParseMatch** content *content*

node main.js GetParseMatch content <string>
Ejemplo -> node main.js GetParseMatch content "Guns"

- node main.js **SearchTracksByArtist** artistName *artistName*

Ejemplo -> node main.js SearchTracksByArtist artistName "Guns N Roses"

- node main.js **SearchTracksByGenres** genres *genres*

Ejemplo -> node main.js SearchTracksByGenres genres ["rock"]

	Métodos GetById

- node main.js **GetArtist** id *id*

Ejemplo -> node main.js GetArtist id "1"

- node main.js **GetAlbum** id *id*

Ejemplo -> node main.js GetAlbum id "1"

- node main.js **GetTrack** id *id*

Ejemplo -> node main.js GetTrack id "1"

- node main.js **GetPlayList** id *id*

Ejemplo -> node main.js GetPlayList id "1"

	Métodos GetAll

- node main.js **GetArtistAll**

Ejemplo -> node main.js GetArtistAll

- node main.js **GetAlbumAll**

Ejemplo -> node main.js GetAlbumAll

- node main.js **GetTrackAll**

Ejemplo -> node main.js GetTrackAll

<<<<<<< HEAD
node main.js GetPlayListsAll
=======
- node main.js **GetPlayListAll**

>>>>>>> fba847e8ebf35e8f24c7d4c0db21c6078c178372
Ejemplo -> node main.js GetPlayListAll
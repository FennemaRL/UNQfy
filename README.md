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


##Docker Commands:

    ** Logg
    docker build -t loggin-image .

    docker run -d -e TOKENWINSTON='0761ce5d-2160-4b48-abda-40b2d80c9fc8' -e DOMAIN='grupocho' --net unqfy-network --ip 172.18.0.2  -p 3003:3003 --name loggin-container -v ~/data:/home/node/my_node_app/app_data --user node loggin-image

    docker stop loggin-container
    docker start loggin-container


    ** Monitor
    docker build -t monitor-image .
   
    docker run -d -e SERVICE_LIST_WIDTH_NAME='[["http://172.18.0.2:3003/api","LOGG"],["http://172.18.0.4:3000/api","UNQFY"],["http://172.18.0.3:3001/api","NewsLetter"]]' -e DISCORD_URI="https://discord.com/api/webhooks/783470040645107773/kP4oMFsVT2SYZPmAS1fkwv5F9ZREKyco5xZbJsHovedjcVzn8X50CHjf14Vu0tV_jeJ7" --net unqfy-network -p 3002:3002 --ip 172.18.0.5 --name monitor-container --user node monitor-image
    
    docker stop monitor-image .
    docker start monitor-image .

     ** News
    docker build -t newsletter-image .
   
    docker run -d -e UNQFY='http://172.18.0.4:3000/api' -e NEWS='http://172.18.0.3:3001/api' -e NEWSLETTER_NAME="UNQfy Grupo 8" -e NEWSLETTER_MAIL='unqfy.grupo.8@gmail.com' --net unqfy-network --ip 172.18.0.3 -p 3001:3001 --name newsletter-container -v ~/data:/home/node/my_node_app/app_data  --user node newsletter-image
    
    docker stop newsletter-container .
    docker start newsletter-container .

    ++ Unquify


    docker build -t unqfy-image .

    docker run -e MUSIXMATCH='8a6a87f75e222f2a1e0e90701bc32cb3' -d -e UNQFY='http://localhost172.18.0.4:3000/api' -e 'NEWS=http://172.18.0.3:3001/api' -e LOGG='http://172.18.0.2:3003/api' --net unqfy-network --ip 172.18.0.4 -p 3000:3000 --name unqfy-container -v ~/data:/home/node/my_node_app/app_data --user node unqfy-image


    docker stop  unqfy-container .
    docker start unqfy-container .

    docker start unqfy-container loggin-container newwsletter-container monitor-container
    
    docker stop unqfy-container loggin-container newsletter-container monitor-container 

    docker network create --driver bridge unqfy-network --subnet=172.18.0.0/27
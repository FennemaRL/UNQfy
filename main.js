

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const { throws } = require('assert');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  console.log(filename)
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/
class Command {
  
  constructor(criteria, fn) {
    this._criteria = criteria;
    this._fn = fn ;
  }
  canHandle(command){
    return criteria === command
  }
  do(unquify, data){
    this._fn(unquify,data);
  }
  sameCriteria(criteria ){
    return this._criteria? this._criteria === criteria : true
  }
}
let commands =[]


let commandAddArtist= (unquify, data) => unquify.addArtist(data)
commands.push(new Command("AddArtist", commandAddArtist))


let commandAddTrack= (unquify, data) => unquify.addTrack(data.albumId, data)
commands.push(new Command("AddTrack", commandAddTrack))

let commandAddAlbum= (unquify, data) => unquify.addAlbum(data.artistId, data)
commands.push(new Command("AddAlbum", commandAddAlbum))

let commandCreatePlaylist= (unquify, data) => unquify.createPlaylist(data.name, data.genres, data.maxDuration)
commands.push(new Command("CreatePlaylist", commandCreatePlaylist))

let commandDeleteArtist= (unquify, data) => unquify.deleteArtist(data.id)
commands.push(new Command("DeleteArtist", commandDeleteArtist))

let commandDeleteAlbum= (unquify, data) => unquify.deleteAlbum(data.id)
commands.push(new Command("DeleteAlbum", commandDeleteAlbum))

let commandDeleteTrack= (unquify, data) => unquify.deleteTrack(data.id)
commands.push(new Command("DeleteTrack", commandDeleteTrack))

let commandDeletePlayList= (unquify, data) => unquify.deletePlayList(data.id)
commands.push(new Command("DeletePlayList", commandDeletePlayList))


let commandErrorParams= (unquify, data) => { throw new Error (`el comando ->"${data.commando}"<- no existe`)}
commands.push(new Command(undefined, commandErrorParams))




function main() {
  console.log('arguments: ');

  let [n, n2, commando, ...arg ] = process.argv
  let unqfy = getUNQfy();
  console.log(unqfy)
  const commandToExec = commands.find(command => command.sameCriteria(commando));

  const data = {commando}
  
  let argsWithNumbers = arg.map( param => Number.isSafeInteger( Number(param)) ? Number(param) : param) 
  argsWithNumbers.forEach((value,indx) => {
    if(! (indx % 2) && value === "genres"){
      let list = argsWithNumbers[indx+1].substring(1, argsWithNumbers[indx+1].length - 1).split(",");
      data[value] = list
    }
    else if(! (indx % 2)) {
      data[value] = argsWithNumbers[indx+1]
    }
  })
  commandToExec.do(unqfy,data)
  console.log(unqfy)
  saveUNQfy(unqfy);

  // fata crear comandos y archivo para carga y comando npm
}

main();

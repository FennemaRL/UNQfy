

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy
const { throws } = require('assert');
const Command = require('./commands/command')
const commadAdd = require('./commands/create/create')
const commandDelete = require('./commands/delete/delete')
const commandGetBy = require('./commands/get-by-id/get-by-id')
const commandGetAll = require('./commands/get-all/get-all')


// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
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

let commands  =commadAdd.concat(commandGetBy, commandDelete, commandGetAll) 




let commandErrorParams= (unquify, data) => { throw new Error (`el comando ->"${data.commando}"<- no existe`)}
commands.push(new Command(undefined, commandErrorParams))




function main() {
  let [n, n2, commando, ...arg ] = process.argv
  let unqfy = getUNQfy();
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
  saveUNQfy(unqfy);

  // fata crear comandos y archivo para carga y comando npm
}

main();

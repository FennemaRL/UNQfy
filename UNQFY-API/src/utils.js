
const unqmod = require("../unqfy");
const fs = require('fs'); 
const filenamev='./app_data/data.json';
function getUNQfy(filename = filenamev) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}
function saveUNQfy(unqfy, filename = filenamev) {
    unqfy.save(filename);
  }

module.exports = { getUNQfy:getUNQfy, saveUNQfy:saveUNQfy }
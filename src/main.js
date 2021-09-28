const config = require('config')
require('prototype.spawn')
require('prototype.creep')
require('prototype.tower')

module.exports.loop = function() {
  // Configurate spawn
  config()

  // Clear memory
  for (let name in Memory.creeps) {
    if(Game.creeps[name] === undefined) {
      delete Memory.creeps[name]
    }
  }

  // Spawn new creep if necessary
  for (let spawnName in Game.spawns) {
    Game.spawns[spawnName].spawnCreepsIfNecessary()
  }

  // Run creep role
  for (let name in Game.creeps) {
    Game.creeps[name].runRole()
  }

  // Start defending
  var towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER)
  for (let tower of towers) {
    tower.defend()
  }
}

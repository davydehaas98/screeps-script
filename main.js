require('prototype.spawn')
require('prototype.creep')
require('prototype.tower')

module.exports.loop = function() {

  // Set minimum creeps
  var allSpawns = _.filter(Game.spawns, s => s.structureType == STRUCTURE_SPAWN)
  for (let spawns of allSpawns) {
    //if (spawns.memory.booted != true) {
      minCreeps = {}
      let numberOfCreeps = {}
      let creepsInRoom = spawns.room.find(FIND_MY_CREEPS)
      var evolve = numberOfCreeps['miner'] = _.sum(creepsInRoom, (c) => c.memory.role == 'miner')
      spawns.memory.minCreeps = minCreeps
      spawns.memory.minCreeps.upgrader = 1
      spawns.memory.minCreeps.builder = 3
      spawns.memory.minCreeps.repairer = 2
      spawns.memory.minCreeps.wallRepairer = 3
      spawns.memory.minCreeps.LongDistanceHarvester = 0
      spawns.memory.minCreeps.claimer = 0
      spawns.memory.minCreeps.harvester = 3-evolve
      spawns.memory.minCreeps.lorry = 3
      spawns.memory.minCreeps.miner = 8
      spawns.memory.minLongDistanceHarvesters = {}
      //spawns.memory.booted = true
    //}
  }

  // Run creep
  for (let name in Memory.creeps) {
    // Clear Memory
    if(Game.creeps[name] == undefined) {
      delete Memory.creeps[name]
    }
  }

  // Run creep role
  for (let name in Game.creeps) {
    Game.creeps[name].runRole()
  }

  // Start defending
  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER)
  for (let tower of towers) {
    tower.defend()
  }

  // Spawn new creep if needed
  for (let spawnName in Game.spawns) {
    Game.spawns[spawnName].spawnCreepsIfNecessary()
  }
}

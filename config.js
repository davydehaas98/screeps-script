module.exports = function () {
  var allSpawns = _.filter(Game.spawns, s => s.structureType === STRUCTURE_SPAWN)
  for (let spawn of allSpawns) {
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS)
    let sourcesInRoom = spawn.room.find(FIND_SOURCES)
    let structuresInRoom = spawn.room.find(FIND_MY_STRUCTURES)
    let minersInRoom = _.sum(creepsInRoom, (c) => c.memory.role === 'miner')
    let rampartsInRoom = _.sum(structuresInRoom, s => s.structureType === STRUCTURE_RAMPART)
    let towersInRoom = _.sum(structuresInRoom, s => s.structureType === STRUCTURE_TOWER)
    spawn.memory.minCreeps = {
      upgrader: 1,
      builder: 4,
      repairer: 3,
      wallRepairer: towersInRoom > 0 ? 0 : 4,
      claimer: 0,
      harvester: sourcesInRoom - minersInRoom,
      lorry: 8,
      miner: 0,
      attacker: 3,
      defender: rampartsInRoom,
    }
    spawn.memory.minLongDistanceHarvesters = {
      W3N8: 0,
    }
  }
}
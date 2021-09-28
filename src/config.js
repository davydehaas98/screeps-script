module.exports = function () {
  var allSpawns = _.filter(Game.spawns, s => s.structureType === STRUCTURE_SPAWN)
  for (let spawn of allSpawns) {
    let creeps = spawn.room.find(FIND_MY_CREEPS)
    let sources = spawn.room.find(FIND_SOURCES)
    let structures = spawn.room.find(FIND_MY_STRUCTURES)
    let miners = _.sum(creeps, (c) => c.memory.role === 'miner')
    let towers = _.sum(structures, s => s.structureType === STRUCTURE_TOWER)
    let ramparts = _.sum(structures, s => s.structureType === STRUCTURE_RAMPART)
    
    spawn.memory.minCreeps = {
      upgrader: 1,
      builder: 4,
      repairer: 3,
      wallRepairer: towers > 0 ? 0 : 4,
      claimer: 0,
      harvester: sources - miners,
      lorry: 8,
      miner: 0,
      attacker: 3,
      defender: ramparts,
    }
    
    spawn.memory.minLongDistanceHarvesters = {
      W3N8: 0,
    }
  }
}
